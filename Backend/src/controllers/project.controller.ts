import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendNotification } from '../utils/notifications';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (userRole === 'estudiante') return res.status(403).json({ error: 'Los estudiantes no pueden crear proyectos.' });

    const { title, abstract, description, category, requiredSkills, timeline, studentLimit, status } = req.body;
    const validInitialStatuses = ['borrador', 'en_revision'];
    const projectStatus = status && validInitialStatuses.includes(status) ? status : 'borrador';

    const project = await prisma.project.create({
      data: {
        title, abstract, description, category, timeline,
        requiredSkills: requiredSkills || [],
        studentLimit: studentLimit || 4,
        solicitanteId: userId as string,
        status: projectStatus,
      },
    });

    res.status(201).json({ message: `Proyecto guardado como ${projectStatus}`, project });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, abstract, description, category, requiredSkills, timeline, studentLimit, status } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    if (project.solicitanteId !== userId && req.user?.role !== 'administrator') {
      return res.status(403).json({ error: 'No tienes permiso para editar' });
    }

    if (project.status !== 'borrador' && project.status !== 'rechazado') {
      return res.status(400).json({ error: 'Solo puedes editar proyectos en borrador o rechazados.' });
    }

    const validStatuses = ['borrador', 'en_revision'];
    const newStatus = status && validStatuses.includes(status) ? status : project.status;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { title, abstract, description, category, requiredSkills, timeline, studentLimit, status: newStatus }
    });

    res.json({ message: 'Proyecto actualizado correctamente', project: updatedProject });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isDeleted: false },
      include: { solicitante: { select: { name: true, email: true, company: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
};

// NUEVO: Administrador evalúa el proyecto
export const reviewProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, feedbackMessage } = req.body; // status esperado: 'validado' o 'rechazado'
    const adminId = req.user?.id;

    if (status !== 'validado' && status !== 'rechazado') {
      return res.status(400).json({ error: 'El estado debe ser validado o rechazado.' });
    }

    if (status === 'rechazado' && !feedbackMessage) {
      return res.status(400).json({ error: 'Debes incluir retroalimentación al rechazar un proyecto.' });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Actualizar el estado del proyecto
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { status }
    });

    // Guardar el feedback si existe
    let feedbackRecord = null;
    if (feedbackMessage) {
      feedbackRecord = await prisma.projectFeedback.create({
        data: {
          projectId: id,
          adminId: adminId as string,
          message: feedbackMessage,
          previousStatus: project.status,
          newStatus: status
        }
      });
    }

    // Enviar la notificación al solicitante
    const notifType = status === 'validado' ? 'solicitud_aprobada' : 'solicitud_rechazada';
    const notifTitle = status === 'validado' ? 'Proyecto Aprobado' : 'Proyecto Rechazado';
    const notifMsg = status === 'validado' 
      ? `Tu proyecto "${project.title}" ha sido aprobado y está en lista de espera.`
      : `Tu proyecto "${project.title}" requiere correcciones. Revisa la retroalimentación.`;

    await sendNotification(project.solicitanteId, notifType, notifTitle, notifMsg);

    res.json({ 
      message: `Proyecto ${status} correctamente`, 
      project: updatedProject,
      feedback: feedbackRecord // <-- ¡Aquí lo exponemos!
    });
  } catch (error) {
    console.error('Error en reviewProject:', error);
    res.status(500).json({ error: 'Error al evaluar el proyecto' });
  }
};

// NUEVO: Actualizar la imagen (thumbnail) del proyecto
export const updateThumbnail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { thumbnailUrl } = req.body;

    if (!thumbnailUrl) {
      return res.status(400).json({ error: 'Se requiere la URL de la imagen.' });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Validar que solo el creador o un admin puedan cambiar la foto
    if (project.solicitanteId !== userId && req.user?.role !== 'administrator') {
      return res.status(403).json({ error: 'No tienes permiso para editar esta imagen.' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { thumbnailUrl }
    });

    res.json({ message: 'Imagen del proyecto actualizada', project: updatedProject });
  } catch (error) {
    console.error('Error en updateThumbnail:', error);
    res.status(500).json({ error: 'Error al actualizar la imagen del proyecto' });
  }
};
