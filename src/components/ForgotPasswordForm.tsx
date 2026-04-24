"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, HelpCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current && !isSuccess) {
      emailInputRef.current.focus();
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(undefined);

    if (!email) {
      setFieldError("Por favor ingresa tu correo electrónico");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldError("Formato de correo electrónico inválido");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success("Enlace enviado si la cuenta existe.", {
        description: "Revisa tu bandeja de entrada o spam."
      });
      
    } catch (err) {
      toast.error("Ha ocurrido un error al intentar enviar el correo.");
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
        <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand/10 mb-4">
          <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 text-brand" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Recuperar Contraseña
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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
              error={fieldError}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-base sm:text-lg min-h-[3rem] py-3"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Enviar Enlace
          </Button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand/5 border border-brand/20 rounded-2xl p-6 text-center space-y-4"
        >
          <p className="text-sm sm:text-base font-medium text-foreground">
            Si existe una cuenta asociada a <span className="font-bold break-all">{email}</span>, se ha enviado un enlace de recuperación.
          </p>
          <Button
            variant="outline"
            className="w-full min-h-[3rem] py-3 mt-2 text-sm sm:text-base"
            onClick={() => {
              setIsSuccess(false);
              setEmail("");
            }}
          >
            Intentar con otro correo
          </Button>
        </motion.div>
      )}

      <div className="text-center pt-2">
        <Link href="/login" className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group p-2">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver a iniciar sesión
        </Link>
      </div>
    </motion.div>
  );
};
