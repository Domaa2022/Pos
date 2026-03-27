using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

class Program
{
    // Representa la aparición de un cliente en un archivo específico
    record ClienteRegistro(string Nombre, string Identificador, DateTime Fecha);

    static void Main(string[] args)
    {
        string carpeta;

        if (args.Length > 0)
            carpeta = args[0];
        else
        {
            Console.Write("Ruta de la carpeta con los archivos: ");
            carpeta = Console.ReadLine()?.Trim() ?? ".";
        }

        if (!Directory.Exists(carpeta))
        {
            Console.WriteLine($"ERROR: La carpeta '{carpeta}' no existe.");
            return;
        }

        // Buscar archivos que tengan una fecha en el nombre (formato YYYYMMDD)
        var archivos = Directory.GetFiles(carpeta, "*.*", SearchOption.TopDirectoryOnly)
            .Where(f => ExtraerFecha(Path.GetFileNameWithoutExtension(f)) != null)
            .OrderBy(f => ExtraerFecha(Path.GetFileNameWithoutExtension(f)))
            .ToList();

        if (archivos.Count == 0)
        {
            Console.WriteLine("No se encontraron archivos con fecha en el nombre (formato YYYYMMDD).");
            return;
        }

        Console.WriteLine($"\nArchivos encontrados: {archivos.Count}");
        foreach (var a in archivos)
            Console.WriteLine($"  {Path.GetFileName(a)} -> {ExtraerFecha(Path.GetFileNameWithoutExtension(a)):yyyy-MM-dd}");

        // Leer todos los registros de todos los archivos
        var todos = new List<ClienteRegistro>();

        foreach (var archivo in archivos)
        {
            var fecha = ExtraerFecha(Path.GetFileNameWithoutExtension(archivo))!.Value;
            var lineas = File.ReadAllLines(archivo, Encoding.UTF8);

            foreach (var linea in lineas)
            {
                var (nombre, id) = ParsearLinea(linea);
                if (nombre != null && id != null)
                    todos.Add(new ClienteRegistro(nombre, id, fecha));
            }
        }

        if (todos.Count == 0)
        {
            Console.WriteLine("\nNo se pudieron extraer registros de los archivos.");
            return;
        }

        // Agrupar por identificador (clave principal) y calcular rango de fechas
        var fechaMaxima = todos.Max(r => r.Fecha);

        var resumen = todos
            .GroupBy(r => r.Identificador)
            .Select(g =>
            {
                var fechaIngreso  = g.Min(r => r.Fecha);
                var fechaUltima   = g.Max(r => r.Fecha);
                var nombre        = g.OrderByDescending(r => r.Fecha).First().Nombre; // nombre más reciente
                var activo        = fechaUltima == fechaMaxima;
                var fechaFin      = activo ? "ACTIVO" : fechaUltima.ToString("yyyy-MM-dd");
                return new
                {
                    Nombre        = nombre,
                    Identificador = g.Key,
                    FechaIngreso  = fechaIngreso.ToString("yyyy-MM-dd"),
                    FechaFin      = fechaFin
                };
            })
            .OrderBy(r => r.Nombre)
            .ToList();

        // ── Mostrar en consola ──────────────────────────────────────────────
        Console.WriteLine($"\n{"NOMBRE",-55} {"IDENTIFICADOR",-16} {"INGRESO",-12} {"FIN / ESTADO"}");
        Console.WriteLine(new string('-', 105));

        foreach (var r in resumen)
            Console.WriteLine($"{r.Nombre,-55} {r.Identificador,-16} {r.FechaIngreso,-12} {r.FechaFin}");

        Console.WriteLine($"\nTotal clientes únicos: {resumen.Count}");
        Console.WriteLine($"Activos   : {resumen.Count(r => r.FechaFin == "ACTIVO")}");
        Console.WriteLine($"Inactivos : {resumen.Count(r => r.FechaFin != "ACTIVO")}");

        // ── Exportar CSV ────────────────────────────────────────────────────
        var csvPath = Path.Combine(carpeta, "clientes_resultado.csv");
        using var sw = new StreamWriter(csvPath, false, new UTF8Encoding(true));
        sw.WriteLine("Nombre,Identificador,Fecha Ingreso,Fecha Finalización");
        foreach (var r in resumen)
            sw.WriteLine($"\"{r.Nombre}\",\"{r.Identificador}\",{r.FechaIngreso},{r.FechaFin}");

        Console.WriteLine($"\nCSV exportado: {csvPath}");
    }

    // ── Extrae la fecha YYYYMMDD del nombre del archivo ────────────────────
    static DateTime? ExtraerFecha(string nombreArchivo)
    {
        var m = Regex.Match(nombreArchivo, @"(\d{8})");
        if (!m.Success) return null;
        if (DateTime.TryParseExact(m.Value, "yyyyMMdd",
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, out var dt))
            return dt;
        return null;
    }

    // ── Parsea una línea: "NOMBRE DEL CLIENTE  1850000385 ;1850000385" ─────
    // El identificador aparece dos veces separado por " ;"
    static (string? nombre, string? id) ParsearLinea(string linea)
    {
        linea = linea.Trim();
        if (string.IsNullOrWhiteSpace(linea)) return (null, null);

        // Buscar el patrón: texto <ESPACIOS> número <ESPACIO>;<número>
        var m = Regex.Match(linea, @"^(.+?)\s+(\d{7,12})\s*;\d+\s*$");
        if (!m.Success) return (null, null);

        var nombre = m.Groups[1].Value.Trim();
        var id     = m.Groups[2].Value.Trim();

        return (nombre, id);
    }
}
