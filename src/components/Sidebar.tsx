"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  Columns,
  FileText,
  Calendar,
  Calculator,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Uses standard tailwind-merge util

const navItems = [
  {
    name: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Malla Curricular",
    href: "/dashboard/curriculum",
    icon: Columns,
  },
  {
    name: "Mis Apuntes",
    href: "/dashboard/notes",
    icon: FileText,
  },
  {
    name: "Calendario",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Calcula Notas",
    href: "/dashboard/calculator",
    icon: Calculator,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-transform md:translate-x-0 -translate-x-full">
      {/* Logo */}
      <div className="flex h-20 items-center justify-start gap-3 px-6">
        <GraduationCap className="h-8 w-8 text-primary dark:text-indigo-400 font-bold" />
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
          PopStudy
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.name} href={item.href} className="relative outline-none">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-zinc-800 border-l-4 border-l-primary border-r border-t border-b border-gray-200 dark:border-zinc-700"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-500 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  )}
                />
                {item.name}
              </div>

            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation (Settings) */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
        <Link href="/dashboard/settings" className="relative outline-none">
          <div
            className={cn(
               "relative z-10 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
              pathname === "/dashboard/settings"
                ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700"
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <Settings className={cn(
              "h-5 w-5",
              pathname === "/dashboard/settings" ? "text-primary" : "text-gray-500 dark:text-zinc-400"
            )} />
            Configuración
          </div>

        </Link>
      </div>
    </aside>

  );
}
