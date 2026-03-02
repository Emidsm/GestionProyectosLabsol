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
        career: true, academicInstitution: true, municipality: true,
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
    if (!avatarUrl) return res.status(400).json({ error: 'Se requiere la URL del avatar.' });

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { avatarUrl },
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
      academicInstitution, career, municipality,
      // Solicitante
      company, jobTitle, activity,
    } = req.body;

    // Construimos el objeto de actualización dinámicamente
    const data: Record<string, any> = {};
    if (phone !== undefined) data.phone = phone;

    if (role === 'estudiante') {
      if (academicInstitution !== undefined) data.academicInstitution = academicInstitution;
      if (career !== undefined) data.career = career;
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
        career: true, academicInstitution: true, municipality: true,
        isActive: true, createdAt: true,
      }
    });

    res.json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
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
        career: true, municipality: true, isActive: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error("PRISMA ERROR getAllUsers:", error); res.status(500).json({ error: String(error) });
  }
};
