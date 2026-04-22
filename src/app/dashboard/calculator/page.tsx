"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CalculatorIcon, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { MOCK_SUBJECTS, MOCK_STUDENT_SUBJECTS, MOCK_EVALUATIONS } from "@/lib/mock-data";
import { Evaluation } from "@/lib/types";

export default function CalculatorPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [subjectEvals, setSubjectEvals] = useState<Evaluation[]>([]);

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

  const currentSubjects = MOCK_STUDENT_SUBJECTS
    .filter(ss => ss.status === 'Cursando')
    .map(ss => {
      const subject = MOCK_SUBJECTS.find(s => s.id === ss.subject_id);
      const evals = MOCK_EVALUATIONS.filter(e => e.course_id === ss.subject_id);
      
      const hasEvals = evals.length > 0;
      const computedEvals = hasEvals ? evals : [
        { id: Math.random(), course_id: ss.subject_id, name: 'Solemne 1', weight: 30, grade: 5.5, is_simulation: false },
        { id: Math.random(), course_id: ss.subject_id, name: 'Solemne 2', weight: 30, grade: undefined, is_simulation: true },
        { id: Math.random(), course_id: ss.subject_id, name: 'Examen', weight: 40, is_simulation: true }
      ];

      let sumWeight = 0;
      let sumNotes = 0;
      computedEvals.forEach(ev => {
        if (ev.grade) {
          sumWeight += ev.weight;
          sumNotes += (ev.grade * ev.weight);
        }
      });
      const currentAvg = sumWeight > 0 ? (sumNotes / sumWeight) : 0;

      const mockUpcoming = [
        "Faltan 3 días • Solemne 2",
        "Faltan 5 días • Control 3",
        "Falta 1 semana • Entrega",
        "Mañana • Exposición"
      ];
      const assignedUpcoming = mockUpcoming[ss.subject_id % mockUpcoming.length];

      return {
        id: ss.id,
        course_id: ss.subject_id,
        name: subject?.name || 'Curso',
        code: subject?.code || 'COD',
        average: currentAvg,
        upcoming: assignedUpcoming,
        evaluations: computedEvals
      };
    });

  const handleSelectSubject = (subject: any) => {
    setSelectedSubject(subject);
    setSubjectEvals(subject.evaluations.map((e: any) => ({...e})));
  };

  const handleGradeChange = (id: number, val: string) => {
    // allow empty strings or floats
    const num = parseFloat(val);
    setSubjectEvals(prev => prev.map(ev => 
      ev.id === id ? { ...ev, grade: val === '' ? undefined : (isNaN(num) ? undefined : num) } : ev
    ));
  };

  const handleWeightChange = (id: number, val: string) => {
    const num = parseFloat(val);
    setSubjectEvals(prev => prev.map(ev => 
      ev.id === id ? { ...ev, weight: isNaN(num) ? 0 : num } : ev
    ));
  };

  const handleAddEval = () => {
    setSubjectEvals(prev => [
      ...prev,
      { id: Math.random(), course_id: selectedSubject.course_id, name: `Evaluación ${prev.length + 1}`, weight: 10, is_simulation: true }
    ]);
  };

  const handleDeleteEval = (id: number) => {
    setSubjectEvals(prev => prev.filter(ev => ev.id !== id));
  };

  // Detailed Calculator Calculations
  let totalSimulatedAvg = 0;
  let totalWeightEntered = 0;
  let totalWeightPossible = 0;
  
  if (selectedSubject) {
    let sumProd = 0;
    subjectEvals.forEach(ev => {
      totalWeightPossible += ev.weight;
      if (ev.grade !== undefined && ev.grade > 0) {
        sumProd += (ev.grade * (ev.weight / 100));
        totalWeightEntered += ev.weight;
      }
    });

    totalSimulatedAvg = sumProd;
  }

  const partialAvg = totalWeightEntered > 0 ? (totalSimulatedAvg / (totalWeightEntered / 100)) : 0;

  return (
    <PageTransition>
      <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8 transition-colors">
        
        {selectedSubject ? (
          // DETAILED CALCULATOR VIEW
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <header className="space-y-4">
              <Button variant="ghost" onClick={() => setSelectedSubject(null)} className="rounded-full pl-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver a Ramos
              </Button>
              <div>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">
                  {selectedSubject.code}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                  Calculadora: {selectedSubject.name}
                </h1>
                <p className="text-gray-500 dark:text-zinc-400">
                  Ingresa o edita notas y porcentajes libremente.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/80 font-bold text-gray-600 dark:text-zinc-300 text-sm">
                       <div className="col-span-5">Evaluación</div>
                       <div className="col-span-3 text-center">Pond. (%)</div>
                       <div className="col-span-3 text-center">Nota</div>
                       <div className="col-span-1"></div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800 max-h-[500px] overflow-y-auto">
                      {subjectEvals.map((ev) => (
                        <div key={ev.id} className={`grid grid-cols-12 gap-4 p-4 items-center ${ev.is_simulation ? 'bg-primary/5 dark:bg-primary/5' : ''} transition-colors`}>
                          <div className="col-span-5 font-medium text-gray-900 dark:text-zinc-100 flex items-center">
                            {ev.name}
                            {ev.is_simulation && <span className="hidden sm:inline-block ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Simulación</span>}
                          </div>
                          <div className="col-span-3">
                             <input 
                               type="number" 
                               min="0" 
                               max="100"
                               value={ev.weight}
                               onChange={(e) => handleWeightChange(ev.id, e.target.value)}
                               className="w-full text-center py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm"
                             />
                          </div>
                          <div className="col-span-3">
                             <input 
                               type="number" 
                               step="0.1" 
                               min="1.0" 
                               max="7.0"
                               value={ev.grade !== undefined ? ev.grade : ''}
                               onChange={(e) => handleGradeChange(ev.id, e.target.value)}
                               placeholder="--"
                               className={`w-full text-center py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold ${ev.grade && ev.grade < 4.0 ? 'text-red-500 border-red-200 dark:border-red-900 focus:ring-red-500/20' : 'text-gray-900 dark:text-white border-gray-200 dark:border-zinc-700'} bg-white dark:bg-zinc-950`}
                             />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <button onClick={() => handleDeleteEval(ev.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-600 dark:text-zinc-400">
                        Total Ponderado: <span className={totalWeightPossible > 100 ? 'text-red-500' : 'text-gray-900 dark:text-white'}>{totalWeightPossible}%</span>
                      </span>
                      <Button variant="outline" size="sm" onClick={handleAddEval} className="border-primary/20 text-primary hover:bg-primary/10">
                        + Añadir Nota
                      </Button>
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-1">
                 <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 text-white shadow-lg sticky top-8">
                   <h3 className="font-medium text-white/80 mb-6">Proyección Actual</h3>
                   
                   <div className="space-y-6">
                     <div>
                       <p className="text-sm text-indigo-100 mb-1">Nota Final Absoluta (0% en faltantes)</p>
                       <p className="text-5xl font-black">{totalSimulatedAvg.toFixed(2)}</p>
                     </div>
                     
                     <div className="pt-4 border-t border-white/20">
                       <p className="text-sm text-indigo-100 mb-1">Para aprobar con 4.0 necesitas</p>
                       <p className="text-2xl font-bold">
                         {totalWeightEntered < 100 
                           ? (((4.0 - totalSimulatedAvg) / ((100 - totalWeightEntered)/100)).toFixed(1))
                           : (totalSimulatedAvg >= 4.0 ? "¡Aprobado!" : "Reprobado")
                         }
                       </p>
                     </div>
                   </div>

                 </div>
               </div>
            </div>
          </div>
        ) : (
          // MAIN CALCULATOR DASHBOARD
          <div className="animate-in fade-in zoom-in-95 duration-200 space-y-8">
            <header className="space-y-4">
              <Button variant="ghost" onClick={() => router.back()} className="rounded-full pl-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  Hola, {user.full_name.split(' ')[0]}
                </h1>
                <p className="text-gray-500 dark:text-zinc-400">
                  Estás en la Semana 8 del Semestre • {user.major}
                </p>
              </div>
            </header>

            <section className="bg-gray-100 dark:bg-zinc-800/80 p-8 rounded-3xl border border-gray-200 dark:border-zinc-700 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-zinc-700 pb-4">
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">Promedio General Simulado</span>
                  <span className="font-bold text-gray-900 dark:text-zinc-100">30% del avance completado</span>
               </div>
               
               <div className="flex items-center gap-6">
                  <span className="text-6xl font-black text-gray-900 dark:text-white">5.8</span>
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-600 dark:bg-zinc-400 rounded-full" style={{ width: '30%' }} />
                  </div>
               </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ramos en Curso</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSubjects.map((subject) => (
                  <div 
                    key={subject.id} 
                    onClick={() => handleSelectSubject(subject)}
                    className="relative bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group overflow-hidden cursor-pointer"
                  >
                    
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">{subject.code}</span>
                      <span className="text-3xl font-black text-gray-900 dark:text-white">{subject.average.toFixed(1)}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 mb-4">{subject.name}</h3>
                    
                    <div className="inline-block px-3 py-1 bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-xs font-medium rounded-full mb-6">
                      Por cursar
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <span>{subject.upcoming}</span>
                    </div>

                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity inset-0 bg-primary/90 flex flex-col items-center justify-center text-white p-6 text-center z-10 backdrop-blur-sm">
                      <CalculatorIcon className="h-8 w-8 mb-2" />
                      <span className="font-bold text-lg">Simular Notas</span>
                      <span className="text-sm opacity-90">Ingresa a la calculadora detallada</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
