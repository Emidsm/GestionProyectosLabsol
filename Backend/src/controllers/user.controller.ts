import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

// Consultar el perfil propio
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true, email: true, name: true, role: true, avatarUrl: true,
        phone: true, company: true, jobTitle: true, activity: true,
        career: true, academicInstitution: true, estado: true, municipality: true,
        isActive: true, createdAt: true,
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// Actualizar el avatar del usuario
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const { avatarUrl } = req.body;
    
    // Solo bloqueamos si el campo no viene en absoluto en la petición
    if (avatarUrl === undefined) {
      return res.status(400).json({ error: 'Se requiere el campo avatarUrl.' });
    }

    // Si mandan un string vacío, lo convertimos a null para limpiar Prisma limpiamente
    const finalAvatarUrl = avatarUrl === "" ? null : avatarUrl;

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { avatarUrl: finalAvatarUrl },
      select: { id: true, name: true, avatarUrl: true }
    });

    res.json({ message: 'Avatar actualizado correctamente', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el avatar' });
  }
};

// NUEVO: Actualizar datos del perfil propio
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    // Campos comunes
    const { phone } = req.body;

    // Campos según rol
    const {
      // Estudiante
      academicInstitution, career, estado, municipality,
      // Solicitante
      company, jobTitle, activity,
    } = req.body;

    // Construimos el objeto de actualización dinámicamente
    const data: Record<string, any> = {};
    if (phone !== undefined) data.phone = phone;

    if (role === 'estudiante') {
      if (academicInstitution !== undefined) data.academicInstitution = academicInstitution;
      if (career !== undefined) data.career = career;
      if (estado !== undefined) data.estado = estado;
      if (municipality !== undefined) data.municipality = municipality;
    }

    if (role === 'solicitante' || role === 'administrator') {
      if (company !== undefined) data.company = company;
      if (jobTitle !== undefined) data.jobTitle = jobTitle;
      if (activity !== undefined) data.activity = activity;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, name: true, role: true, avatarUrl: true,
        phone: true, company: true, jobTitle: true, activity: true,
        career: true, academicInstitution: true, estado: true, municipality: true,
        isActive: true, createdAt: true,
      }
    });

    res.json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// NUEVO: Obtener un usuario por ID (solo admin)
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, name: true, role: true, avatarUrl: true,
        phone: true, company: true, jobTitle: true, activity: true,
        career: true, academicInstitution: true, estado: true, municipality: true,
        isActive: true, isBaseAdmin: true, createdAt: true,
        projectsCreated: {
          select: { id: true, title: true, status: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// NUEVO: Eliminar un usuario (solo admin)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const requesterId = req.user?.id;

    if (id === requesterId) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta.' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.isBaseAdmin) {
      return res.status(403).json({ error: 'No se puede eliminar al administrador base.' });
    }

    // Borrado real. Por las relaciones onDelete: Cascade del schema, esto también
    // elimina sus proyectos, inscripciones y notificaciones asociadas.
    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// NUEVO: Listar todos los usuarios (solo admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true, email: true, name: true, role: true, avatarUrl: true,
        phone: true, company: true, jobTitle: true, academicInstitution: true,
        career: true, estado: true, municipality: true, isActive: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error("PRISMA ERROR getAllUsers:", error); res.status(500).json({ error: String(error) });
  }
};
