import { prisma } from '../config/database';
import { NotificationType } from '@prisma/client';

export const sendNotification = async (userId: string, type: NotificationType, title: string, message: string) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      }
    });
  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};
