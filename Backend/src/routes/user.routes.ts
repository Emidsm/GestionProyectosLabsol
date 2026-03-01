import { Router } from 'express';
import { getProfile, updateAvatar } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (requieren estar logueado)
router.get('/profile', verifyToken, getProfile);
router.put('/avatar', verifyToken, updateAvatar); // Ruta para guardar la imagen de MinIO

export default router;
