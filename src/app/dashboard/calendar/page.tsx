"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        toast.error("Error al obtener perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Generate mock calendar days for "Abril 2026"
  const daysInMonth = 30;
  const startingDayOfWeek = 2; // Wednesday is index 2 if Monday is 0

  const calendarDays = [];
  // previous month padding
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ padding: true, day: 31 - startingDayOfWeek + i + 1 });
  }
  // current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ padding: false, day: i });
  }

  // Mock Events
  const events = [
    { day: 3, title: "Control 2 Física", time: "10:00", subject: "Física I" },
    { day: 5, title: "Tarea Estructuras", time: "23:59", subject: "Estructuras" },
    { day: 10, title: "Laboratorio 4 Mecánica", time: "14:00", subject: "Mecánica Clásica" },
    { day: 16, title: "Prueba Cálculo", time: "00:00", subject: "Cálculo II" },
    { day: 26, title: "Entrega Proyecto Ing. Software", time: "23:59", subject: "Ing. de Software" }
  ];

  return (
    <PageTransition>
      <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 transition-colors flex flex-col lg:flex-row gap-8">
        
        {/* Main Calendar View */}
        <div className="flex-1 space-y-8">
          <header className="space-y-4 flex flex-col items-start">
            <Button variant="ghost" onClick={() => router.back()} className="rounded-full pl-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex justify-between items-end w-full">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Calendario
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 mt-1">
                  Gestiona tus próximos compromisos académicos.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center border border-gray-300 dark:border-zinc-700">
                  <span className="font-bold text-gray-600 dark:text-zinc-300 text-sm">US</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">{user.full_name}</span>
              </div>
            </div>
          </header>


          {/* Calendar Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                 <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                 <ChevronRight className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
              </Button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-2 mr-2">Abril 2026</h2>
              <Button variant="outline" size="sm" className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300">
                Hoy
              </Button>
            </div>

            <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-lg">
               <button className="px-4 py-1.5 text-sm font-medium bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-md shadow-sm">Mes</button>
               <button className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200">Semana</button>
               <button className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200">Día</button>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
             
             {/* Header */}
             <div className="grid grid-cols-7 border-b border-gray-200 dark:border-zinc-800">
               {DAYS_OF_WEEK.map((day) => (
                 <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-zinc-400">
                   {day}
                 </div>
               ))}
             </div>

             {/* Days Grid */}
             <div className="grid grid-cols-7 auto-rows-[120px] divide-y divide-x divide-gray-100 dark:divide-zinc-800/50 -ml-[1px] -mt-[1px]">
               {calendarDays.map((dateObj, i) => {
                 const dayEvents = events.filter(e => !dateObj.padding && e.day === dateObj.day);
                 const isToday = dateObj.day === 24 && !dateObj.padding; // mock today

                 return (
                   <div key={i} className={`p-2 border-l border-t border-gray-100 dark:border-zinc-800/50 relative ${dateObj.padding ? 'bg-gray-50/50 dark:bg-zinc-900/30 text-gray-400 dark:text-zinc-600' : 'text-gray-700 dark:text-zinc-300'}`}>
                     <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-gray-600 text-white dark:bg-gray-500' : ''}`}>
                       {dateObj.day}
                     </span>
                     
                     <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                       {dayEvents.map((ev, j) => (
                         <div key={j} className="text-[10px] leading-tight p-1.5 rounded bg-gray-100 dark:bg-zinc-800/80 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 truncate">
                           <span className="font-semibold block truncate">{ev.title}</span>
                           <span className="text-gray-500 dark:text-zinc-400">{ev.time}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        {/* Sidebar Events */}
        <aside className="w-full lg:w-80 space-y-6 pt-2">
          <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-700 border shadow-sm">
            + Agendar Evento
          </Button>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 space-y-6 min-h-[500px] flex flex-col">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Próximos Eventos</h3>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3">Mañana</p>
                <div className="border-l-2 border-gray-300 dark:border-zinc-700 pl-4 space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Laboratorio 4 Física</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Mecánica Clásica</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 mt-1">14:00 hrs</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-6 mb-3">En 3 días</p>
                <div className="border-l-2 border-gray-300 dark:border-zinc-700 pl-4 space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Solemne 2</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Estructuras</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 mt-1">10:00 tras 1010tos</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-6 mb-3">En 5 días</p>
                <div className="border-l-2 border-gray-300 dark:border-zinc-700 pl-4 space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Entrega Proyecto</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Ingeniería de Software</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 mt-1">23:59 hrs</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-auto border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800">
              Ver todo el calendario
            </Button>
          </div>
        </aside>

      </div>
    </PageTransition>
  );
}
