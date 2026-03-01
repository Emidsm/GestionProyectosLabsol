import { Request, Response } from 'express';
import { uploadFileToMinio } from '../services/minio.service';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // Multer inyecta el archivo en req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No se detectó ningún archivo en la petición.' });
    }

    const url = await uploadFileToMinio(req.file);
    
    res.status(200).json({ 
      message: 'Imagen subida exitosamente',
      url 
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error interno al procesar la imagen' });
  }
};
