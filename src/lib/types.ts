export interface User {
  id: string; // UUID from Auth
}

export interface Profile {
  id: number;
  user_id: string;
  full_name: string;
  rut?: string;
  avatar_url?: string;
}

export interface Curriculum {
  id: number;
  profile_id: number;
  name: string;
  institution: string;
  career: string;
  total_credits: number;
  total_semester: number;
}

export interface Subject {
  id: number;
  curriculum_id: number;
  name: string;
  code: string;
  credits: number;
  semester_number: number;
  area_type: string; // e.g. "Especialidad", "Formación General"
}

export interface SubjectPrerequisite {
  id: number;
  subject_id: number;
  prerequisite_id: number;
  is_strict: boolean;
}

export type SubjectStatus = 'Aprobado' | 'Cursando' | 'Bloqueado' | 'Por cursar';

export interface StudentSubject {
  id: number;
  profile_id: number;
  subject_id: number;
  status: SubjectStatus;
}

export interface CalendarEvent {
  id: number;
  profile_id: number;
  course_id?: number; 
  title: string;
  description?: string;
  start_datetime: string; // ISO date string
  end_datetime: string; // ISO date string
  event_type: string;
  color_hex?: string;
}

export interface EventReminder {
  id: number;
  event_id: number;
  user_id: number; // refers to profile.id
}

export interface Evaluation {
  id: number;
  course_id: number;
  name: string;
  weight: number; 
  grade?: number;
  is_simulation: boolean;
}

export interface Note {
  id: number;
  course_id: number;
  title: string;
  tag?: string;
}

export interface Material {
  id: number;
  course_id: number;
  file_name: string;
  tag?: string;
  bucket_url: string;
  sizeMB?: number; // Added for frontend mockup UI (Mis Apuntes size)
  uploadDate?: string; // Added for frontend mockup UI
}

export interface Tag {
  id: number;
  name: string;
  color_hex: string;
}

export interface NoteTag {
  note_id: number;
  tag_id: number;
}

export interface MaterialTag {
  note_id: number; // Per diagram field name
  tag_id: number;
}
