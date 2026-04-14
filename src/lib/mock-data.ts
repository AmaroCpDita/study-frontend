import {
  Profile,
  Curriculum,
  Subject,
  StudentSubject,
  Evaluation,
  Material,
  CalendarEvent
} from './types';

// Mock Profile
export const MOCK_PROFILE: Profile = {
  id: 1,
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  full_name: 'AmaroCpDita'
};

// Mock Curriculum
export const MOCK_CURRICULUM: Curriculum = {
  id: 1,
  profile_id: 1,
  name: 'Malla Analista Programador 2024',
  institution: 'Universidad de Ejemplo',
  career: 'Analista Ejemplificador',
  total_credits: 240,
  total_semester: 8
};

// Mock Subjects
export const MOCK_SUBJECTS: Subject[] = [
  { id: 1, curriculum_id: 1, name: 'Cálculo I', code: 'MAT101', credits: 6, semester_number: 1, area_type: 'ESPECIALIDAD' },
  { id: 2, curriculum_id: 1, name: 'Física I', code: 'FIS101', credits: 6, semester_number: 1, area_type: 'ESPECIALIDAD' },
  { id: 3, curriculum_id: 1, name: 'Comunicación', code: 'HUM101', credits: 4, semester_number: 1, area_type: 'FORMACIÓN GENERAL' },
  { id: 4, curriculum_id: 1, name: 'Ética', code: 'FG101', credits: 4, semester_number: 1, area_type: 'FORMACIÓN SELLO' },
  { id: 5, curriculum_id: 1, name: 'Cálculo II', code: 'MAT102', credits: 6, semester_number: 2, area_type: 'ESPECIALIDAD' },
  { id: 6, curriculum_id: 1, name: 'Física II', code: 'FIS102', credits: 6, semester_number: 2, area_type: 'ESPECIALIDAD' },
  { id: 7, curriculum_id: 1, name: 'Liderazgo', code: 'HUM102', credits: 4, semester_number: 2, area_type: 'FORMACIÓN GENERAL' },
  { id: 8, curriculum_id: 1, name: 'Deporte', code: 'OPT101', credits: 2, semester_number: 2, area_type: 'FORMACIÓN OPTATIVA' },
  { id: 9, curriculum_id: 1, name: 'Ecuaciones', code: 'MAT201', credits: 6, semester_number: 3, area_type: 'ESPECIALIDAD' },
  { id: 10, curriculum_id: 1, name: 'Mecánica Clásica', code: 'FIS201', credits: 6, semester_number: 3, area_type: 'ESPECIALIDAD' }
];

// Mock Student Subject States
export const MOCK_STUDENT_SUBJECTS: StudentSubject[] = [
  { id: 1, profile_id: 1, subject_id: 1, status: 'Aprobado' },
  { id: 2, profile_id: 1, subject_id: 2, status: 'Aprobado' },
  { id: 3, profile_id: 1, subject_id: 3, status: 'Aprobado' },
  { id: 4, profile_id: 1, subject_id: 4, status: 'Aprobado' },
  { id: 5, profile_id: 1, subject_id: 5, status: 'Aprobado' },
  { id: 6, profile_id: 1, subject_id: 6, status: 'Cursando' },
  { id: 7, profile_id: 1, subject_id: 7, status: 'Cursando' },
  { id: 8, profile_id: 1, subject_id: 8, status: 'Cursando' },
  { id: 9, profile_id: 1, subject_id: 9, status: 'Cursando' },
  { id: 10, profile_id: 1, subject_id: 10, status: 'Bloqueado' }
];

// Mock Materials (Notes)
export const MOCK_MATERIALS: Material[] = [
  { id: 1, course_id: 10, file_name: 'Teoremas de Conservación.pdf', tag: 'Clase 4', bucket_url: '#', sizeMB: 1.2, uploadDate: '15/04/2024' },
  { id: 2, course_id: 10, file_name: 'Guía Problemas Resueltos.pdf', tag: 'Clase 3', bucket_url: '#', sizeMB: 2.4, uploadDate: '08/04/2024' },
  { id: 3, course_id: 10, file_name: 'Apuntes Movimiento.pdf', tag: 'Clase 2', bucket_url: '#', sizeMB: 1.8, uploadDate: '01/04/2024' },
];

export const MOCK_EVALUATIONS: Evaluation[] = [
  { id: 1, course_id: 6, name: 'Prueba 1', weight: 30, grade: 5.5, is_simulation: false },
  { id: 2, course_id: 6, name: 'Prueba 2', weight: 30, grade: 6.0, is_simulation: false },
  { id: 3, course_id: 6, name: 'Examen', weight: 40, is_simulation: true }
];
