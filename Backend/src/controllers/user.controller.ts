import { Request, Response } from 'express';
import { prisma } from '../config/database';

// Obtener todos los usuarios activos
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      // Ocultamos la contraseña y mostramos solo lo relevante
      select: { 
        id: true, name: true, email: true, role: true, 
        academicInstitution: true, company: true, createdAt: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Desactivar un usuario (Soft Delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Usuario desactivado correctamente', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: 'Error al desactivar el usuario' });
  }
};
