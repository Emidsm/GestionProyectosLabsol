/**
 * api.ts — Cliente centralizado para el backend de ProConecta
 * 
 * Base URL: http://localhost:4000 (ajusta según tu .env)
 * Todos los endpoints protegidos requieren el token JWT de la cookie proconecta_token
 */

import { getTokenFromCookies } from './cookie-utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ============================================================
// TIPOS ALINEADOS CON EL BACKEND (schema.prisma + controllers)
// ============================================================

/** Estados tal como los guarda Prisma en la BD */
export type BackendProjectStatus =
  | 'borrador'
  | 'en_revision'
  | 'validado'
  | 'en_curso'
  | 'finalizado'
  | 'rechazado';

/** Mapa de status backend → etiqueta legible en UI */
export const STATUS_LABELS: Record<BackendProjectStatus, string> = {
  borrador: 'Borrador',
  en_revision: 'En revisión',
  validado: 'En lista de espera',
  en_curso: 'En desarrollo',
  finalizado: 'Finalizado',
  rechazado: 'Rechazado con retroalimentación',
};

/** Proyecto tal como lo devuelve GET /api/projects */
export interface ApiProject {
  id: string;
  title: string;
  abstract: string;
  description: string;
  category: string;
  status: BackendProjectStatus;
  requiredSkills: string[];
  timeline: string;
  studentLimit: number;
  thumbnailUrl?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  solicitanteId: string;
  /** Incluido por el controller con select: { name, email, company } */
  solicitante: {
    name: string;
    email: string;
    company?: string;
  };
}

/** Inscripción tal como la devuelve GET /api/enrollments/project/:id */
export interface ApiEnrollment {
  id: string;
  studentId: string;
  projectId: string;
  status: 'pendiente' | 'aceptado' | 'rechazado';
  enrolledAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  student: {
    name: string;
    email: string;
    career?: string;
  jobTitle?: string;
  municipality?: string;
  activity?: string;
    academicInstitution?: string;
  };
}

/** Usuario tal como lo devuelve GET /api/auth/me o GET /api/users/profile */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'solicitante' | 'estudiante';
  avatarUrl?: string;
  phone?: string;
  company?: string;
  academicInstitution?: string;
  career?: string;
  jobTitle?: string;
  municipality?: string;
  activity?: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================================
// HELPER INTERNO
// ============================================================

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getTokenFromCookies();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(errorBody.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ============================================================
// PROYECTOS
// ============================================================

/** GET /api/projects — devuelve todos los proyectos no eliminados */
export async function getProjects(): Promise<ApiProject[]> {
  return apiFetch<ApiProject[]>('/api/projects');
}

/** POST /api/projects — crea un proyecto */
export async function createProject(data: {
  title: string;
  abstract?: string;
  description: string;
  category?: string;
  requiredSkills?: string[];
  timeline?: string;
  studentLimit?: number;
  status?: 'borrador' | 'en_revision';
}): Promise<{ message: string; project: ApiProject }> {
  return apiFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** PUT /api/projects/:id — edita un proyecto (solo borrador o rechazado) */
export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    abstract: string;
    description: string;
    category: string;
    requiredSkills: string[];
    timeline: string;
    studentLimit: number;
    status: 'borrador' | 'en_revision';
  }>
): Promise<{ message: string; project: ApiProject }> {
  return apiFetch(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** PUT /api/projects/:id/review — admin aprueba o rechaza (solo admin) */
export async function reviewProject(
  id: string,
  data: { status: 'validado' | 'rechazado'; feedbackMessage?: string }
): Promise<{ message: string; project: ApiProject }> {
  return apiFetch(`/api/projects/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ============================================================
// INSCRIPCIONES
// ============================================================

/** POST /api/enrollments — estudiante se inscribe a un proyecto */
export async function enrollInProject(
  projectId: string
): Promise<{ message: string; enrollment: ApiEnrollment }> {
  return apiFetch('/api/enrollments', {
    method: 'POST',
    body: JSON.stringify({ projectId }),
  });
}

/** GET /api/enrollments/project/:projectId — lista inscripciones de un proyecto */
export async function getProjectEnrollments(
  projectId: string
): Promise<ApiEnrollment[]> {
  return apiFetch(`/api/enrollments/project/${projectId}`);
}

/** PUT /api/enrollments/:id/review — admin acepta o rechaza una inscripción */
export async function reviewEnrollment(
  enrollmentId: string,
  status: 'aceptado' | 'rechazado'
): Promise<{ message: string; enrollment: ApiEnrollment }> {
  return apiFetch(`/api/enrollments/${enrollmentId}/review`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/** POST /api/enrollments/force — admin inscribe a un estudiante por email */
export async function forceEnrollStudent(data: {
  projectId: string;
  email: string;
}): Promise<{ message: string; enrollment: ApiEnrollment }> {
  return apiFetch('/api/enrollments/force', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================================
// USUARIO
// ============================================================

/** GET /api/users/profile — perfil del usuario autenticado */
export async function getMyProfile(): Promise<ApiUser> {
  return apiFetch<ApiUser>('/api/users/profile');
}

/** PUT /api/users/avatar — actualiza el avatar del usuario */
export async function updateAvatar(
  avatarUrl: string | null
): Promise<{ message: string; user: ApiUser }> {
  // Si mandamos un string vacío desde el frontend, lo forzamos a null
  // para que Prisma entienda que queremos borrar el campo.
  const finalUrl = avatarUrl === "" ? null : avatarUrl;
  
  return apiFetch('/api/users/avatar', {
    method: 'PUT',
    body: JSON.stringify({ avatarUrl: finalUrl }),
  });
}

// ============================================================
// UPLOAD
// ============================================================

/**
 * POST /api/upload/image — sube una imagen a MinIO.
 * Ahora recibe directamente el FormData que armamos en la UI.
 */
export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  const token = getTokenFromCookies();

  const res = await fetch(`${API_URL}/api/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData, // Mandamos el FormData directo, sin reempaquetar
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error al subir imagen' }));
    throw new Error(err.error);
  }

  return res.json();
}

// ============================================================
// NUEVOS ENDPOINTS DE USUARIO
// ============================================================

/** GET /api/users — lista todos los usuarios (solo admin) */
export async function getAllUsers(): Promise<ApiUser[]> {
  return apiFetch<ApiUser[]>('/api/users');
}

/** PUT /api/users/profile — actualiza datos del perfil propio */
export async function updateProfile(data: Partial<{
  phone: string;
  academicInstitution: string;
  career: string;
  municipality: string;
  company: string;
  jobTitle: string;
  activity: string;
}>): Promise<{ message: string; user: ApiUser }> {
  return apiFetch('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
