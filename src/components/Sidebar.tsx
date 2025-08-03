"use client";

import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  CreditCard,
  FileText,
  Settings,
  Store,
  X,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

/**
 * Sidebar component renders a collapsible sidebar with navigation links and logout functionality.
 *
 * @param {boolean} sidebarOpen - Indicates whether the sidebar is open or closed.
 * @param {function} setSidebarOpen - Function to toggle the sidebar open state.
 *
 * This component includes navigation links to various sections of the application,
 * each represented with an icon and a label. Some items may include a badge to indicate
 * notifications or counts. The sidebar can be toggled using a close button and also provides
 * a logout button at the bottom.
 */
export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const menuItems = [
    { icon: ShoppingCart, label: "Ventas", href: "/ventas", badge: "3" },
    { icon: Package, label: "Inventario", href: "/inventario" },
    { icon: Users, label: "Clientes", href: "/clientes" },
    { icon: BarChart3, label: "Reportes", href: "/reportes" },
    { icon: CreditCard, label: "Pagos", href: "/pagos" },
    { icon: FileText, label: "Facturas", href: "/facturas" },
    { icon: Settings, label: "Configuración", href: "/configuracion" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform h-screen flex flex-col ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <div className="flex items-center space-x-2 mt-0.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">POS System</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <nav className="mt-6 px-3 flex flex-1 justify-between flex-col">
        <div className="flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center justify-between mb-5 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 group text-base"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-800 text-xs px-2 py-0.5"
                >
                  {item.badge}
                </Badge>
              )}
            </a>
          ))}
        </div>

        <div className="w-full p-4 border-t">
          <Button
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-base py-3"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </nav>
    </div>
  );
}
