import type { User } from './types';

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

export function setUserCookie(user: User): void {
  if (typeof window === 'undefined') return;
  document.cookie = `proconecta_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
}

// NUEVO: Guardar el token JWT
export function setTokenCookie(token: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = `proconecta_token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

// NUEVO: Obtener el token (útil para inyectarlo en las cabeceras de tus fetch)
export function getTokenFromCookies(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('proconecta_token='));
  
  if (!tokenCookie) return null;
  return tokenCookie.split('=')[1];
}

export function clearUserCookie(): void {
  if (typeof window === 'undefined') return;
  // Limpiamos tanto el usuario como el token
  document.cookie = 'proconecta_user=; path=/; max-age=0';
  document.cookie = 'proconecta_token=; path=/; max-age=0';
  localStorage.removeItem('proconecta_user');
}
