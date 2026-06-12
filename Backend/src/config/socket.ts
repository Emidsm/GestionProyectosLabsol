import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { config } from './env';

let io: SocketIOServer | null = null;

/**
 * Inicializa Socket.IO sobre el servidor HTTP existente.
 * - Autentica cada conexión con el JWT (mismo secreto que la API REST).
 * - Mete a cada usuario en su propia "room" (`user:<id>`) para notificarlo.
 * - Si hay REDIS_URL, usa el adaptador Redis (pub/sub) para escalar a varias
 *   instancias. Si Redis no está disponible, sigue funcionando en una sola.
 */
export const initSocket = async (httpServer: HttpServer): Promise<SocketIOServer> => {
  io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
  });

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const pubClient = createClient({ url: redisUrl });
      const subClient = pubClient.duplicate();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      console.log('✅ Socket.IO usando adaptador Redis (multi-instancia)');
    } catch (err) {
      console.warn('⚠️ No se pudo conectar a Redis; Socket.IO seguirá en modo single-instance.', err);
    }
  }

  // Middleware de autenticación: el cliente envía el token en handshake.auth.token
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Token no proporcionado'));
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error('Token inválido o expirado'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string | undefined;
    if (userId) socket.join(`user:${userId}`);
  });

  console.log('✅ Socket.IO inicializado');
  return io;
};

/** Emite un evento en tiempo real a todas las conexiones de un usuario. */
export const emitToUser = (userId: string, event: string, payload: unknown): void => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};
