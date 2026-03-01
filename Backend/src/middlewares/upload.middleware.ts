import multer from 'multer';

// Usamos almacenamiento en memoria (buffer) porque lo mandaremos directo a MinIO
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Protegemos el servidor con un límite de 5MB por imagen
});
