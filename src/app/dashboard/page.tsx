"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { LogOut, Home, BookOpen, Calendar, Settings, User as UserIcon, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";

import { Sidebar } from "@/components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          window.location.href = "/login";
        }
      } catch (err) {
        toast.error("Error al obtener la información del perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const logoutToast = toast.loading("Cerrando sesión...");
    try {
      await fetch("/api/logout", { method: "POST" });
      toast.success("¡Sesión terminada exitosamente!", { id: logoutToast });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Hubo un problema al cerrar la sesión", { id: logoutToast });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading || !user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <div className="absolute h-full w-full rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <GraduationCap className="h-8 w-8 text-primary dark:text-indigo-400 animate-pulse" />
            </div>
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium animate-pulse">
              Cargando tu espacio...
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-zinc-950 flex">
        {/* Main Navigation Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto md:ml-64">
          <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12 transition-colors">
            
            <header className="flex justify-between items-start">
              <div className="space-y-1">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 flex items-center gap-2"
                >
                  ¡Bienvenido de nuevo, {user.full_name.split(' ')[0]}! 👋
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500 dark:text-zinc-400"
                >
                  {user.major} en {user.institution}
                </motion.p>
              </div>
              
              <div className="flex items-center gap-4">
                <Link href="/dashboard/profile" className="hidden md:flex items-center gap-3 mr-2 group cursor-pointer">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 group-hover:text-primary transition-colors">{user.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">{user.institution}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <span className="font-bold text-primary text-sm">
                      {user.full_name?.substring(0, 2).toUpperCase() || "US"}
                    </span>
                  </div>
                </Link>
                <Button 
                  variant="outline" 

                  size="sm" 
                  onClick={handleLogout} 
                  isLoading={isLoggingOut}
                  className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 group"
                >
                  <LogOut className="h-4 w-4 text-destructive md:mr-2 transition-colors group-hover:text-red-500" />
                  <span className="hidden md:inline text-destructive transition-colors group-hover:text-red-500">Cerrar Sesión</span>
                </Button>
              </div>

            </header>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <StatCard title="Promedio General" value="5.8" trend="+0.2 este mes" />
              <StatCard title="Tareas Pendientes" value="12" trend="3 para hoy" />
              <StatCard title="Horas de Estudio" value="24h" trend="Semana actual" />
            </motion.section>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative p-10 bg-white dark:bg-zinc-900/70 backdrop-blur-sm rounded-3xl text-center border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-primary/5 rounded-full blur-[80px] -z-10" />
              
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Tu área de trabajo está lista</h2>
              <p className="text-gray-500 dark:text-zinc-300 max-w-md mx-auto mb-8">
                Selecciona "Mis Cursos" para comenzar a planificar tu semana y revisar próximos exámenes.
              </p>
              <Button size="lg" className="rounded-full shadow-xl shadow-primary/20 px-8">
                <BookOpen className="mr-2 h-5 w-5" /> Explorar Cursos
              </Button>
            </motion.div>

          </div>
        </main>
      </div>
    </PageTransition>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active 
          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
          : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-200"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </a>
  );
}



function StatCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group">
      <p className="text-gray-500 dark:text-zinc-300 text-sm font-semibold mb-2 group-hover:text-primary transition-colors">{title}</p>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">{value}</span>
        <span className="text-sm text-primary font-bold mb-1 bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20">{trend}</span>
      </div>
    </div>
  );
}


