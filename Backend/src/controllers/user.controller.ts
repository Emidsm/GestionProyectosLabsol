import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';

// Consultar el perfil propio
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, company: true, career: true, academicInstitution: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// NUEVO: Actualizar el avatar del usuario
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const { avatarUrl } = req.body;
    
    if (!avatarUrl) {
      return res.status(400).json({ error: 'Se requiere la URL del avatar.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { avatarUrl },
      select: { id: true, name: true, avatarUrl: true } // Solo devolvemos datos seguros
    });

    res.json({ message: 'Avatar actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error('Error en updateAvatar:', error);
    res.status(500).json({ error: 'Error al actualizar el avatar' });
  }
};
