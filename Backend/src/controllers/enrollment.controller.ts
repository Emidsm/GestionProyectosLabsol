import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendNotification } from '../utils/notifications';

export const enrollInProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { projectId } = req.body;

    if (userRole !== 'estudiante') return res.status(403).json({ error: 'Solo los estudiantes pueden inscribirse a proyectos.' });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

    const acceptedCount = await prisma.enrollment.count({ where: { projectId: projectId, status: 'aceptado' } });
    if (acceptedCount >= project.studentLimit) return res.status(400).json({ error: 'El proyecto ya ha alcanzado su límite de estudiantes.' });

    const enrollment = await prisma.enrollment.create({ data: { studentId: userId as string, projectId: projectId } });
    res.status(201).json({ message: 'Solicitud enviada correctamente', enrollment });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Ya has enviado una solicitud para este proyecto.' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const forceEnrollStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, email } = req.body;
    const student = await prisma.user.findUnique({ where: { email } });
    if (!student || student.role !== 'estudiante') return res.status(404).json({ error: 'Estudiante no encontrado.' });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

    const acceptedCount = await prisma.enrollment.count({ where: { projectId: projectId, status: 'aceptado' } });
    if (acceptedCount >= project.studentLimit) {
      await prisma.project.update({ where: { id: projectId }, data: { studentLimit: acceptedCount + 1 } });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_projectId: { studentId: student.id, projectId: projectId } },
      update: { status: 'aceptado', acceptedAt: new Date() },
      create: { studentId: student.id, projectId: projectId, status: 'aceptado', acceptedAt: new Date() }
    });

    res.json({ message: 'Estudiante agregado exitosamente', enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Error al forzar la inscripción' });
  }
};

export const getProjectEnrollments = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const enrollments = await prisma.enrollment.findMany({
      where: { projectId },
      include: { student: { select: { name: true, email: true, career: true, academicInstitution: true } } },
      orderBy: { enrolledAt: 'desc' }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

// NUEVO: El administrador evalúa la inscripción del estudiante
export const reviewEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // ID de la inscripción (enrollment)
    const { status } = req.body; // 'aceptado' o 'rechazado'

    if (status !== 'aceptado' && status !== 'rechazado') {
      return res.status(400).json({ error: 'El estado debe ser aceptado o rechazado.' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });

    // Si vamos a aceptar, verificamos que no se haya llenado el cupo en el interín
    if (status === 'aceptado') {
      const acceptedCount = await prisma.enrollment.count({
        where: { projectId: enrollment.projectId, status: 'aceptado' }
      });

      if (acceptedCount >= enrollment.project.studentLimit) {
        return res.status(400).json({ error: 'El proyecto ya está lleno. No puedes aceptar más estudiantes.' });
      }
    }

    // Actualizamos la inscripción
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        acceptedAt: status === 'aceptado' ? new Date() : null,
        rejectedAt: status === 'rechazado' ? new Date() : null,
      }
    });

    // Notificamos al estudiante su resultado
    const notifTitle = status === 'aceptado' ? 'Inscripción Aprobada' : 'Inscripción Rechazada';
    const notifMsg = status === 'aceptado' 
      ? `¡Felicidades! Fuiste aceptado en el proyecto "${enrollment.project.title}".`
      : `Lo sentimos, tu solicitud para "${enrollment.project.title}" no fue aprobada.`;
    
    await sendNotification(enrollment.studentId, status === 'aceptado' ? 'solicitud_aprobada' : 'solicitud_rechazada', notifTitle, notifMsg);

    // Verificamos si con este estudiante se llenó el cupo del proyecto
    if (status === 'aceptado') {
      const newCount = await prisma.enrollment.count({
        where: { projectId: enrollment.projectId, status: 'aceptado' }
      });

      if (newCount === enrollment.project.studentLimit) {
        // Notificamos al creador del proyecto
        await sendNotification(enrollment.project.solicitanteId, 'proyecto_finalizado', '¡Equipo Completo!', `Tu proyecto "${enrollment.project.title}" ha completado su límite de estudiantes.`);
        
        // Notificamos a todos los estudiantes inscritos
        const allAccepted = await prisma.enrollment.findMany({ where: { projectId: enrollment.projectId, status: 'aceptado' } });
        for (const record of allAccepted) {
          await sendNotification(record.studentId, 'nuevo_integrante', '¡Es hora de empezar!', `El equipo para "${enrollment.project.title}" está completo y listo para el desarrollo.`);
        }
      }
    }

    res.json({ message: `Inscripción ${status} correctamente`, enrollment: updatedEnrollment });
  } catch (error) {
    console.error('Error en reviewEnrollment:', error);
    res.status(500).json({ error: 'Error al evaluar la inscripción' });
  }
};
