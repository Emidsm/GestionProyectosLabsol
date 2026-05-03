import nodemailer from 'nodemailer';
import { prisma } from '../config/database';
import { NotificationType } from '@prisma/client'; // Importamos el tipo real

// Creamos el transporter dinámicamente para mayor seguridad
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendNotification = async (
  userId: string,
  type: NotificationType, // Volvemos al tipo estricto para que Prisma no se confunda
  title: string,
  message: string
) => {
  try {
    // 1. Persistencia en Base de Datos - MANDATORIO
    // Usamos 'await' para asegurar que se cree antes de seguir
    const newNotification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    });
    console.log(`✅ Notificación guardada en DB (ID: ${newNotification.id})`);

    // 2. Obtener correo del destinatario[cite: 2]
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    // Si el usuario no tiene correo o falló la persistencia previa, salimos
    if (!user?.email) {
      console.warn(`⚠️ No se encontró correo para el usuario ${userId}, pero la notificación quedó en la DB.`);
      return;
    }

    // 3. Configuración y envío del Correo
    const mailOptions = {
      from: `"Labsol Proyectos" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: title,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">Hola, ${user.name}</h2>
          <p style="font-size: 16px; color: #555;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <footer style="font-size: 12px; color: #888;">
            Este es un mensaje automático de la plataforma de Gestión Labsol.
          </footer>
        </div>
      `,
    };

    const transporter = getTransporter();
    
    // Envío asíncrono para no retrasar la respuesta de la API
    transporter.sendMail(mailOptions)
      .then(() => console.log(`📧 Email enviado exitosamente a ${user.email}`))
      .catch((err) => console.error('❌ Error enviando el correo:', err));

  } catch (error) {
    // Si entra aquí, es muy probable que Prisma haya chillado por el Enum o el ID
    console.error('❌ Error crítico en el sistema de notificaciones:', error);
  }
};
