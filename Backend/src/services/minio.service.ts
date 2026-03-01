import { minioClient } from '../config/minio';
import { config } from '../config/env';
import crypto from 'crypto';
import path from 'path';

export const uploadFileToMinio = async (file: Express.Multer.File): Promise<string> => {
  // 1. Extraer la extensión original (ej. .jpg, .png)
  const extension = path.extname(file.originalname);
  
  // 2. Generar un nombre único aleatorio
  const fileName = `${crypto.randomUUID()}${extension}`;

  // 3. Subir el archivo al bucket de MinIO
  await minioClient.putObject(
    config.minioBucket,
    fileName,
    file.buffer, // El contenido en memoria del archivo
    file.size,
    { 'Content-Type': file.mimetype } // Para que el navegador sepa que es una imagen
  );

  // 4. Retornar la URL pública para guardarla en la BD
  return `http://localhost:${config.minioPort}/${config.minioBucket}/${fileName}`;
};
