'use client';

import { io, type Socket } from 'socket.io-client';
import { getTokenFromCookies } from './cookie-utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

/**
 * Devuelve un socket autenticado (singleton). Se conecta usando el JWT de la
 * cookie; si no hay sesión, regresa null.
 */
export function getSocket(): Socket | null {
  const token = getTokenFromCookies();
  if (!token) return null;

  if (!socket) {
    socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
