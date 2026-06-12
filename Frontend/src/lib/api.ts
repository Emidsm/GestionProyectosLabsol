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
  category: string | null;
  status: BackendProjectStatus;
  requiredSkills: string[];
  timeline: string | null;
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
  estado?: string;
  municipality?: string;
  activity?: string;
  isActive: boolean;
  createdAt: string;
}

/** Inscripción Pendiente tal como la devuelve GET /api/enrollments/admin/pending */
export interface ApiPendingEnrollment {
  id: string;
  enrolledAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    career: string;
    academicInstitution: string;
    avatarUrl: string | null;
  };
  project: {
    id: string;
    title: string;
    solicitante: {
      name: string;
    };
  };
}

/** Notificación tal como la devuelve GET /api/notifications */
export interface ApiNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'solicitud_aprobada' | 'solicitud_rechazada' | 'inscripcion_nueva' | 'sistema';
  isRead: boolean;
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

/**
 * GET /api/projects/:id — un proyecto con control de acceso en el servidor.
 * Lanza Error('No tienes permiso para ver este proyecto.') con un 403 si el
 * usuario no puede verlo (p. ej. una solicitud en revisión que no es suya).
 */
export async function getProject(id: string): Promise<ApiProject> {
  return apiFetch<ApiProject>(`/api/projects/${id}`);
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

/** PUT /api/enrollments/:id/review — admin acepta o rechaza una inscripción (usado desde la vista de un proyecto) */
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

/** GET /api/enrollments/admin/pending — admin lista todas las inscripciones pendientes globales */
export async function getPendingEnrollments(): Promise<ApiPendingEnrollment[]> {
  return apiFetch<ApiPendingEnrollment[]>('/api/enrollments/admin/pending');
}

/** PATCH /api/enrollments/:id/status — admin acepta o rechaza una inscripción desde el dashboard general */
export async function updateEnrollmentStatus(
  id: string, 
  status: 'aceptado' | 'rechazado'
): Promise<{ message: string; enrollment: any }> {
  return apiFetch(`/api/enrollments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
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

export interface ApiUserDetail extends ApiUser {
  isBaseAdmin?: boolean;
  projectsCreated: { id: string; title: string; status: BackendProjectStatus }[];
}

/** GET /api/users/:id — detalle de un usuario (solo admin) */
export async function getUserById(id: string): Promise<ApiUserDetail> {
  return apiFetch<ApiUserDetail>(`/api/users/${id}`);
}

/** DELETE /api/users/:id — elimina un usuario (solo admin) */
export async function deleteUser(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/users/${id}`, { method: 'DELETE' });
}

/** PUT /api/users/profile — actualiza datos del perfil propio */
export async function updateProfile(data: Partial<{
  phone: string;
  academicInstitution: string;
  career: string;
  estado: string;
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

/** GET /api/enrollments/my — lista las inscripciones del estudiante logueado */
export async function getMyEnrollments(): Promise<ApiEnrollment[]> {
  return apiFetch<ApiEnrollment[]>('/api/enrollments/my');
}

// ============================================================
// NOTIFICACIONES
// ============================================================

/** GET /api/notifications — lista las notificaciones del usuario logueado */
export async function getMyNotifications(): Promise<ApiNotification[]> {
  return apiFetch<ApiNotification[]>('/api/notifications');
}

/** PATCH /api/notifications/read-all — marca todas como leídas */
export async function markNotificationsAsRead(): Promise<{ message: string }> {
  return apiFetch('/api/notifications/read-all', {
    method: 'PATCH',
  });
}

/** PATCH /api/notifications/:id/read — marca una sola como leída */
export async function markOneNotificationAsRead(id: string): Promise<ApiNotification> {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

// ============================================================
// CATÁLOGOS (Carreras / Estados / Municipios)
// ============================================================

export interface ApiCarrera {
  id: string;
  nombre: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEstado {
  id: string;
  nombre: string;
}

export interface ApiMunicipio {
  id: string;
  nombre: string;
  estadoId: string;
}

/** GET /api/catalog/carreras — lista de carreras */
export async function getCarreras(): Promise<ApiCarrera[]> {
  return apiFetch<ApiCarrera[]>('/api/catalog/carreras');
}

/** POST /api/catalog/carreras — crea una carrera (admin) */
export async function createCarrera(
  nombre: string
): Promise<{ message: string; carrera: ApiCarrera }> {
  return apiFetch('/api/catalog/carreras', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  });
}

/** PUT /api/catalog/carreras/:id — edita una carrera (admin) */
export async function updateCarrera(
  id: string,
  data: Partial<{ nombre: string; isActive: boolean }>
): Promise<{ message: string; carrera: ApiCarrera }> {
  return apiFetch(`/api/catalog/carreras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** DELETE /api/catalog/carreras/:id — elimina una carrera (admin) */
export async function deleteCarrera(id: string): Promise<{ message: string }> {
  return apiFetch(`/api/catalog/carreras/${id}`, {
    method: 'DELETE',
  });
}

/** GET /api/catalog/estados — lista de estados (INEGI) */
export async function getEstados(): Promise<ApiEstado[]> {
  return apiFetch<ApiEstado[]>('/api/catalog/estados');
}

/** GET /api/catalog/municipios?estadoId= — municipios de un estado (INEGI) */
export async function getMunicipios(estadoId: string): Promise<ApiMunicipio[]> {
  return apiFetch<ApiMunicipio[]>(
    `/api/catalog/municipios?estadoId=${encodeURIComponent(estadoId)}`
  );
}
