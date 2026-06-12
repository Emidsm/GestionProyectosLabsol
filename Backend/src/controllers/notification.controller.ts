import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Traemos solo las últimas 20 para no saturar
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error en getMyNotifications:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

export const markOneNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params as { id: string };

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Filtramos también por userId para no permitir marcar notificaciones ajenas.
    const result = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    const notification = await prisma.notification.findUnique({ where: { id } });
    res.json(notification);
  } catch (error) {
    console.error('Error en markOneNotificationAsRead:', error);
    res.status(500).json({ error: 'Error al actualizar la notificación' });
  }
};

export const markNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    await prisma.notification.updateMany({
      where: { 
        userId,
        isRead: false // Solo actualizamos las que no han sido leídas
      },
      data: { isRead: true }
    });

    res.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error en markNotificationsAsRead:', error);
    res.status(500).json({ error: 'Error al actualizar notificaciones' });
  }
};
