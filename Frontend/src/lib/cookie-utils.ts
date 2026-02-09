import type { User } from './types';

/**
 * Get user from cookies (client-side)
 * This is a synchronous operation, no useEffect needed
 */
export function getUserFromCookies(): User | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split('; ');
  const userCookie = cookies.find(row => row.startsWith('proconecta_user='));
  
  if (!userCookie) return null;
  
  try {
    const userJson = userCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(userJson));
  } catch {
    return null;
  }
}

/**
 * Set user cookie (client-side)
 */
export function setUserCookie(user: User): void {
  document.cookie = `proconecta_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Strict`;
}

/**
 * Clear user cookie (logout)
 */
export function clearUserCookie(): void {
  document.cookie = 'proconecta_user=; path=/; max-age=0';
}
