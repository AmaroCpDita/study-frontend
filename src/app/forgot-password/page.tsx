import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { GraduationCap } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function ForgotPasswordPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#020617] p-4 py-12">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        
        <div className="z-10 flex flex-col items-center gap-8 w-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="bg-brand p-2.5 rounded-2xl shadow-xl shadow-brand/20">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-foreground">
              Pop<span className="text-brand">Study</span>
            </span>
          </div>

          {/* Form Section */}
          <ForgotPasswordForm />

          {/* Footer info */}
          <footer className="mt-8 text-xs text-muted-foreground/60 font-medium">
            © 2024 PopStudy Platform. Todos los derechos reservados.
          </footer>
        </div>
      </main>
    </PageTransition>
  );
}
