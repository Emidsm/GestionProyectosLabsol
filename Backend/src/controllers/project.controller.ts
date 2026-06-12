import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendNotification } from '../utils/notifications';

// ============================================================
// CREAR PROYECTO
// ============================================================
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (userRole === 'estudiante') {
      return res.status(403).json({ error: 'Los estudiantes no pueden crear proyectos.' });
    }

    const { title, abstract, description, category, requiredSkills, timeline, studentLimit, status } = req.body;
    
    const validInitialStatuses = ['borrador', 'en_revision'];
    const projectStatus = status && validInitialStatuses.includes(status) ? status : 'borrador';

    const project = await prisma.project.create({
      data: {
        title,
        abstract,
        description,
        category,
        timeline,
        requiredSkills: requiredSkills || [],
        studentLimit: studentLimit || 4,
        solicitanteId: userId as string,
        status: projectStatus,
      },
      // Incluimos al solicitante para que el frontend reciba la data completa de una vez
      include: {
        solicitante: { 
          select: { name: true, email: true, company: true, avatarUrl: true } 
        }
      }
    });

    res.status(201).json({ message: `Proyecto guardado como ${projectStatus}`, project });
  } catch (error) {
    console.error('Error en createProject:', error);
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
};

// ============================================================
// ACTUALIZAR PROYECTO
// ============================================================
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, abstract, description, category, requiredSkills, timeline, studentLimit, status } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    const isAdminUser = req.user?.role === 'administrator';

    // Permisos: Solo dueño o Admin
    if (project.solicitanteId !== userId && !isAdminUser) {
      return res.status(403).json({ error: 'No tienes permiso para editar este proyecto.' });
    }

    // El solicitante solo puede editar borradores o rechazados. El admin puede
    // completar los datos faltantes (categoría, duración, habilidades, cupo) en
    // cualquier estado, porque "lo demás lo llena el admin".
    if (!isAdminUser && project.status !== 'borrador' && project.status !== 'rechazado') {
      return res.status(400).json({ error: 'Solo puedes editar proyectos en borrador o rechazados.' });
    }

    const validStatuses = ['borrador', 'en_revision'];
    const newStatus = status && validStatuses.includes(status) ? status : project.status;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { 
        title, abstract, description, category, requiredSkills, timeline, studentLimit, 
        status: newStatus 
      },
      include: {
        solicitante: { select: { name: true, email: true, company: true, avatarUrl: true } }
      }
    });

    res.json({ message: 'Proyecto actualizado correctamente', project: updatedProject });
  } catch (error) {
    console.error('Error en updateProject:', error);
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
};

// ============================================================
// OBTENER TODOS LOS PROYECTOS (Catálogo)
// ============================================================
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Visibilidad por rol. Aplicamos el control de acceso en el servidor para
    // que no se pueda "forzar" el endpoint y ver solicitudes que no son
    // públicas (borradores o en revisión / lista de espera) o ajenas.
    const where: any = { isDeleted: false };

    if (userRole === 'estudiante') {
      // El estudiante solo ve el catálogo público: proyectos ya validados,
      // en curso o finalizados. Nunca borradores ni solicitudes en revisión.
      where.status = { in: ['validado', 'en_curso', 'finalizado'] };
    } else if (userRole === 'solicitante') {
      // El solicitante solo ve sus propios proyectos (en cualquier estado).
      where.solicitanteId = userId;
    }
    // El administrador ve todo lo no eliminado.

    const projects = await prisma.project.findMany({
      where,
      include: {
        // CLAVE: Incluir avatarUrl para que las ProjectCards no salgan vacías[cite: 1, 10]
        solicitante: { 
          select: { name: true, email: true, company: true, avatarUrl: true } 
        }, 
        feedback: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error en getProjects:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
};

// ============================================================
// OBTENER UN PROYECTO POR ID (con control de acceso)
// ============================================================
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const project = await prisma.project.findFirst({
      where: { id, isDeleted: false },
      include: {
        solicitante: { select: { name: true, email: true, company: true, avatarUrl: true } },
        feedback: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

    const isPublic = ['validado', 'en_curso', 'finalizado'].includes(project.status);
    const isOwner = project.solicitanteId === userId;
    const isAdminUser = userRole === 'administrator';

    // Reglas de visibilidad: admin todo; solicitante solo lo suyo; estudiante
    // solo proyectos públicos. Si no aplica, negamos el acceso (no forzar el link).
    const allowed =
      isAdminUser ||
      isOwner ||
      (userRole === 'estudiante' && isPublic);

    if (!allowed) {
      return res.status(403).json({ error: 'No tienes permiso para ver este proyecto.' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error en getProjectById:', error);
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
};

// ============================================================
// REVISIÓN DE ADMINISTRADOR (Aprobar/Rechazar)
// ============================================================
export const reviewProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, feedbackMessage } = req.body; 
    const adminId = req.user?.id;

    if (status !== 'validado' && status !== 'rechazado') {
      return res.status(400).json({ error: 'El estado debe ser validado o rechazado.' });
    }

    if (status === 'rechazado' && !feedbackMessage) {
      return res.status(400).json({ error: 'Debes incluir retroalimentación al rechazar un proyecto.' });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { status },
      include: {
        solicitante: { select: { name: true, email: true, company: true, avatarUrl: true } }
      }
    });

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

    // Notificaciones (Persistencia en DB y envío de Email)[cite: 2]
    const notifType = status === 'validado' ? 'solicitud_aprobada' : 'solicitud_rechazada';
    const notifTitle = status === 'validado' ? 'Proyecto Aprobado' : 'Proyecto Rechazado';
    const notifMsg = status === 'validado' 
      ? `Tu proyecto "${project.title}" ha sido aprobado y está en lista de espera.`
      : `Tu proyecto "${project.title}" requiere correcciones. Revisa la retroalimentación.`;

    await sendNotification(project.solicitanteId, notifType, notifTitle, notifMsg);

    res.json({ 
      message: `Proyecto ${status} correctamente`, 
      project: updatedProject,
      feedback: feedbackRecord 
    });
  } catch (error) {
    console.error('Error en reviewProject:', error);
    res.status(500).json({ error: 'Error al evaluar el proyecto' });
  }
};

// ============================================================
// ACTUALIZAR THUMBNAIL DEL PROYECTO
// ============================================================
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

    if (project.solicitanteId !== userId && req.user?.role !== 'administrator') {
      return res.status(403).json({ error: 'No tienes permiso para editar esta imagen.' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { thumbnailUrl },
      include: {
        solicitante: { select: { name: true, email: true, company: true, avatarUrl: true } }
      }
    });

    res.json({ message: 'Imagen del proyecto actualizada', project: updatedProject });
  } catch (error) {
    console.error('Error en updateThumbnail:', error);
    res.status(500).json({ error: 'Error al actualizar la imagen del proyecto' });
  }
};
