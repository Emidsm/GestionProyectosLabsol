import type { User } from './types';

/**
 * Obtiene el usuario de las cookies de forma segura (Client-side).
 * Retorna null durante SSR para evitar errores de hidratación inicial.
 */
export function getUserFromCookies(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(row => row.startsWith('proconecta_user='));
    
    if (!userCookie) return null;
    
    const userJson = userCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(userJson));
  } catch {
    return null;
  }
}

/**
 * Guarda la cookie del usuario (Client-side).
 * Asegúrate de pasar el objeto 'user' SIN contraseña.
 */
export function setUserCookie(user: User): void {
  if (typeof window === 'undefined') return;
  // SameSite=Lax permite que la cookie persista en navegaciones normales
  document.cookie = `proconecta_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
}

/**
 * Elimina la cookie y limpia localStorage (Logout).
 */
export function clearUserCookie(): void {
  if (typeof window === 'undefined') return;
  document.cookie = 'proconecta_user=; path=/; max-age=0';
  localStorage.removeItem('proconecta_user');
}
