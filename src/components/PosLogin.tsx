"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";

import supabase from "@/lib/supabaseClient";

export default function POSLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    rememberMe: false,
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!showCreateAccount) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.username,
        password: formData.password,
      });
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        router.push("/dashboard");
      }
    } else {
      const { error: signupError } = await supabase.auth.signUp({
        email: formData.username,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name, // esto va a user_metadata
          },
        },
      });

      if (signupError) {
        console.log(signupError);
      } else {
        alert("Usuario registrado. Revisa tu correo para confirmar.");
      }
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="shadow-2xl border-0 overflow-hidden p-6">
          <div className="flex flex-col lg:flex-row">
            {/* Sección de imagen */}
            <div className="lg:w-1/2 bg-gradient-to-br rounded-3xl from-blue-600 to-indigo-700 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
              <Image
                src="/image/tienda.jpg"
                alt="Sistema POS moderno"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Sección del formulario */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <CardHeader className="space-y-4 pb-8 px-0">
                <div className="text-center lg:text-left">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {showCreateAccount ? "Crear Cuenta" : "Iniciar Sesión"}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {showCreateAccount
                      ? "Crea una cuenta para acceder al sistema"
                      : "Ingresa tus credenciales para acceder al sistema"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {showCreateAccount && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nombre
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Ingresa tu nombre"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Correo Electronico
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Ingresa tu correo"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-2 ${
                      showCreateAccount ? "invisible" : "visible"
                    }`}
                  >
                    <div>
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          handleInputChange("rememberMe", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Recordar sesión
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {showCreateAccount
                            ? "Creando cuenta..."
                            : "Iniciando sesión..."}
                        </span>
                      </div>
                    ) : showCreateAccount ? (
                      "Crear Cuenta"
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  {!showCreateAccount ? (
                    <Button
                      onClick={() => setShowCreateAccount(true)}
                      variant="link"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Crea una cuenta
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowCreateAccount(false)}
                      variant="link"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Iniciar sesión
                    </Button>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="text-center text-xs text-gray-500">
                    <p>Sistema POS v2.1.0</p>
                    <p className="mt-1">
                      © 2024 Tu Empresa. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
