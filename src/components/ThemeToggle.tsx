"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 h-10 w-10 p-0 rounded-full shadow-lg z-50 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"

      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 transition-all scale-100 rotate-0" />
      ) : (
        <Moon className="h-5 w-5 text-zinc-900 transition-all scale-100 rotate-0" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
