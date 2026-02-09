export type Role = "administrator" | "solicitante" | "estudiante";

export type ProjectStatus =
  | "Borrador"
  | "En revisión"
  | "En lista de espera" // Aprobado
  | "Rechazado con retroalimentación"
  | "En desarrollo"
  | "Finalizado";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;          // SRS: Teléfono
  
  // Datos de Solicitante (SRS)
  company?: string;        // SRS: Nombre de la empresa/institución (opcional)
  jobTitle?: string;       // SRS: Cargo en la empresa (opcional)
  activity?: string;       // SRS: Giro o Actividad (opcional)
  
  // Datos de Estudiante (SRS)
  municipality?: string;        // SRS: Municipio de procedencia
  academicInstitution?: string; // SRS: Institución académica
  career?: string;              // SRS: Carrera
  
  bio?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;       // SRS: Descripción (antes abstract)
  generalObjective: string;  // SRS: Objetivo general
  expectedActivities: string;// SRS: Actividades esperadas
  category: string;
  status: ProjectStatus;
  solicitante: User;
  requiredSkills: string[];
  timeline: string;
  studentLimit: number;
  studentsEnrolled: User[];
  feedback?: string; 
  createdAt?: string;
  updatedAt?: string;
}
