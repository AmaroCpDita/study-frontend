"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email on load
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors: {email?: string, password?: string} = {};
    setError(null);
    setFieldErrors({});

    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Formato de correo electrónico inválido";
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(newErrors);
      setError("Por favor corrige los errores del formulario");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    const loginToast = toast.loading("Verificando credenciales...");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      toast.success(data.message || "¡Bienvenido de nuevo!", { id: loginToast });
      router.push("/dashboard");
    } catch (err: any) {
      // Show API errors in toasts
      toast.error(err.message || "Credenciales incorrectas o error de red", { id: loginToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:max-w-md p-6 sm:p-8 glass rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl space-y-6 sm:space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground italic">
          Tu éxito académico comienza aquí.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl flex items-center gap-2 overflow-hidden"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
            <Input
              ref={emailInputRef}
              label="Correo Electrónico"
              type="email"
              placeholder="ejemplo@popstudy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full"
              inputMode="email"
              disabled={isLoading}
              error={fieldErrors.email}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 w-full"
              disabled={isLoading}
              error={fieldErrors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9 text-muted-foreground hover:text-foreground transition-colors z-10 p-1"
              title={showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
              tabIndex={-1}
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors group">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-input text-brand focus:ring-brand h-4 w-4" 
              disabled={isLoading}
            />
            Recordarme
          </label>
          <Link href="/forgot-password" className="text-xs sm:text-sm text-brand font-medium hover:underline transition-all">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full text-base sm:text-lg min-h-[3rem] py-3 mt-4"
          isLoading={isLoading}
          disabled={isLoading}
        >
          <LogIn className="mr-2 h-5 w-5" />
          Iniciar Sesión
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-brand font-bold hover:underline transition-all">
            Regístrate ahora
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
