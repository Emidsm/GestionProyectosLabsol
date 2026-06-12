import { Request, Response } from 'express';
import { prisma } from '../config/database';

// ============================================================
// CARRERAS (CRUD dinámico para el administrador)
// ============================================================

export const getCarreras = async (_req: Request, res: Response) => {
  try {
    const carreras = await prisma.carrera.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error en getCarreras:', error);
    res.status(500).json({ error: 'Error al obtener las carreras' });
  }
};

export const createCarrera = async (req: Request, res: Response) => {
  try {
    const nombre = (req.body?.nombre ?? '').trim();
    if (!nombre) return res.status(400).json({ error: 'El nombre de la carrera es requerido.' });

    const carrera = await prisma.carrera.create({ data: { nombre } });
    res.status(201).json({ message: 'Carrera creada correctamente', carrera });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe una carrera con ese nombre.' });
    }
    console.error('Error en createCarrera:', error);
    res.status(500).json({ error: 'Error al crear la carrera' });
  }
};

export const updateCarrera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { nombre, isActive } = req.body;

    const data: { nombre?: string; isActive?: boolean } = {};
    if (typeof nombre === 'string') {
      const trimmed = nombre.trim();
      if (!trimmed) return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
      data.nombre = trimmed;
    }
    if (typeof isActive === 'boolean') data.isActive = isActive;

    const carrera = await prisma.carrera.update({ where: { id }, data });
    res.json({ message: 'Carrera actualizada correctamente', carrera });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe una carrera con ese nombre.' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Carrera no encontrada.' });
    }
    console.error('Error en updateCarrera:', error);
    res.status(500).json({ error: 'Error al actualizar la carrera' });
  }
};

export const deleteCarrera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.carrera.delete({ where: { id } });
    res.json({ message: 'Carrera eliminada correctamente' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Carrera no encontrada.' });
    }
    console.error('Error en deleteCarrera:', error);
    res.status(500).json({ error: 'Error al eliminar la carrera' });
  }
};

// ============================================================
// ESTADOS Y MUNICIPIOS (catálogo INEGI, solo lectura)
// ============================================================

export const getEstados = async (_req: Request, res: Response) => {
  try {
    const estados = await prisma.estado.findMany({ orderBy: { nombre: 'asc' } });
    res.json(estados);
  } catch (error) {
    console.error('Error en getEstados:', error);
    res.status(500).json({ error: 'Error al obtener los estados' });
  }
};

export const getMunicipios = async (req: Request, res: Response) => {
  try {
    const { estadoId, estado } = req.query as { estadoId?: string; estado?: string };

    if (!estadoId && !estado) {
      return res.status(400).json({ error: 'Debes indicar estadoId o estado.' });
    }

    const municipios = await prisma.municipio.findMany({
      where: estadoId ? { estadoId } : { estado: { nombre: estado } },
      orderBy: { nombre: 'asc' },
    });
    res.json(municipios);
  } catch (error) {
    console.error('Error en getMunicipios:', error);
    res.status(500).json({ error: 'Error al obtener los municipios' });
  }
};
