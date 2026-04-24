"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Building, GraduationCap, Edit2, IdCard, ChevronLeft, X, Save } from "lucide-react";

import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { MOCK_SUBJECTS, MOCK_STUDENT_SUBJECTS } from "@/lib/mock-data";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: "", institution: "", major: "", rut: "", avatar_url: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setEditData({ 
            full_name: data.user.full_name, 
            institution: data.user.institution, 
            major: data.user.major,
            rut: data.user.rut || "",
            avatar_url: data.user.avatar_url || ""
          });
        }
      } catch (err) {
        toast.error("Error al obtener la información del perfil.");

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

  // Get subjects that are 'Aprobado' and attach a mock grade for display based on the mockup.
  const academicHistory = MOCK_STUDENT_SUBJECTS
    .filter(ss => ss.status === 'Aprobado')
    .map(ss => {
      const subject = MOCK_SUBJECTS.find(s => s.id === ss.subject_id);
      // Give some pseudo-random but realistic looking grades for the mock
      const mockGrades = [5.5, 6.2, 5.0, 6.8, 4.5, 5.8];
      const assignedGrade = mockGrades[ss.subject_id % mockGrades.length];
      
      return {
        id: ss.id,
        name: subject?.name || 'Curso Desconocido',
        semester: subject?.semester_number || 1,
        credits: subject?.credits || 0,
        grade: assignedGrade,
      };
    });

  return (
    <PageTransition>
      <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8 transition-colors">
        
        <header className="space-y-4 flex flex-col items-start">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full pl-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Perfil del Usuario
          </h1>
        </header>


        {/* Profile Card */}
        <section className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative">
          
          <div className="h-32 w-32 shrink-0 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-900 shadow-sm mx-auto md:mx-0">
             {user.avatar_url ? (
               <img src={user.avatar_url} alt="User Avatar" className="h-full w-full object-cover" />
             ) : (
               <UserIcon className="h-16 w-16 text-gray-400 dark:text-zinc-600" />
             )}
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <IdCard className="h-4 w-4" />
                <span>Rut: {user.rut || "No especificado"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Carrera: {user.major}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Building className="h-4 w-4" />
                <span>Institución: {user.institution}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                <span>Correo Electrónico: {user.full_name.toLowerCase().replace(" ", ".")}@email.com</span>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="mt-4 md:mt-0 w-full md:w-auto shrink-0 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-zinc-100"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </section>


        {/* Academic History Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Historial Académico
          </h2>

          <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-300 font-semibold border-b border-gray-200 dark:border-zinc-700">
                  <tr>
                    <th scope="col" className="px-6 py-4">Nombre del Curso</th>
                    <th scope="col" className="px-6 py-4 text-center">Semestre</th>
                    <th scope="col" className="px-6 py-4 text-center">Nota Final</th>
                    <th scope="col" className="px-6 py-4 text-center">Créditos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800/80">
                  {academicHistory.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-zinc-100">{course.name}</td>
                      <td className="px-6 py-4 text-center text-gray-500 dark:text-zinc-400">Semestre {course.semester}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">{course.grade.toFixed(1)}</td>
                      <td className="px-6 py-4 text-center font-medium text-gray-600 dark:text-zinc-300">{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsEditing(false)} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Editar Perfil</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={editData.full_name}
                  onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">RUT</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={editData.rut}
                  onChange={(e) => setEditData({...editData, rut: e.target.value})}
                  placeholder="12.345.678-9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Avatar de Perfil (URL)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={editData.avatar_url}
                  onChange={(e) => setEditData({...editData, avatar_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Institución</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={editData.institution}
                  onChange={(e) => setEditData({...editData, institution: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Carrera</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={editData.major}
                  onChange={(e) => setEditData({...editData, major: e.target.value})}
                />
              </div>

            </div>

            <Button 
              className="w-full mt-8" 
              onClick={() => {
                setUser({ ...user, ...editData });
                setIsEditing(false);
                toast.success("Perfil actualizado localmente.");
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      )}
    </PageTransition>

  );
}
