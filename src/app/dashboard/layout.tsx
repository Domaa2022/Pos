"use client";

import { UserProvider } from "@/components/context/UserContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UserProvider>
      {/* Sidebar */}
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col">
          <Header setSidebarOpen={setSidebarOpen} />
          <div className="w-full p-6">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}
