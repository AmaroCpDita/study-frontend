"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserPlus, Mail, Lock, AlertCircle, Building2, BookOpen, User, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    institution: "",
    major: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    full_name?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (pw.length === 0) return { score: 0, text: "", color: "bg-muted" };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 1;

    if (score <= 2) return { score, text: "Débil", color: "bg-destructive" };
    if (score === 3 || score === 4) return { score, text: "Media", color: "bg-orange-500" };
    return { score, text: "Fuerte", color: "bg-green-500" };
  };

  const strength = getPasswordStrength();

  const validateForm = () => {
    let isValid = true;
    const newErrors: {
      full_name?: string;
      email?: string;
      password?: string;
      confirm_password?: string;
    } = {};
    setError(null);
    setFieldErrors({});

    if (!formData.full_name) {
      newErrors.full_name = "El nombre es obligatorio";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Formato de correo electrónico inválido";
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Debes confirmar la contraseña";
      isValid = false;
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden";
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
    const regToast = toast.loading("Creando cuenta...");

    try {
      // Backend expects these fields without confirm_password
      const submitData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        institution: formData.institution,
        major: formData.major
      };
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      toast.success(data.message || "¡Registro exitoso! Iniciando sesión...", { id: regToast });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Error de red al intentar registrarse", { id: regToast });
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
          Crea tu cuenta
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground italic">
          Únete a PopStudy
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
            <User className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
              <Input
                ref={nameInputRef}
                label="Nombre Completo *"
                name="full_name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.full_name}
                onChange={handleChange}
                className="pl-10 w-full"
                disabled={isLoading}
                error={fieldErrors.full_name}
              />
          </div>

          <div className="relative">
            <Mail className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
              <Input
                label="Correo Electrónico *"
                name="email"
                type="email"
                placeholder="ejemplo@popstudy.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full"
                inputMode="email"
                disabled={isLoading}
                error={fieldErrors.email}
              />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    label="Contraseña *"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
              
              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <div className="flex flex-col gap-1 px-1">
                  <div className="flex h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strength.color}`} 
                      style={{ width: `${Math.max(20, (strength.score / 5) * 100)}%` }} 
                    />
                  </div>
                  <p className={`text-xs font-medium text-right ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.text}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  label="Confirmar Contraseña *"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="pl-10 pr-10 w-full"
                  disabled={isLoading}
                  error={fieldErrors.confirm_password}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-9 text-muted-foreground hover:text-foreground transition-colors z-10 p-1"
                    title={showConfirmPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Building2 className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
              <Input
                label="Institución"
                name="institution"
                type="text"
                placeholder="Universidad..."
                value={formData.institution}
                onChange={handleChange}
                className="pl-10 text-ellipsis w-full"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <BookOpen className="absolute left-3.5 top-9 h-4 w-4 text-muted-foreground z-10" />
              <Input
                label="Carrera"
                name="major"
                type="text"
                placeholder="Ingeniería..."
                value={formData.major}
                onChange={handleChange}
                className="pl-10 text-ellipsis w-full"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full text-base sm:text-lg min-h-[3rem] py-3 mt-4"
          isLoading={isLoading}
          disabled={isLoading}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Registrarse
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-brand font-bold hover:underline transition-all">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
