import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// El middleware 'upload.single("image")' buscará un archivo enviado con la clave "image"
router.post('/image', verifyToken, upload.single('image'), uploadImage);

export default router;
