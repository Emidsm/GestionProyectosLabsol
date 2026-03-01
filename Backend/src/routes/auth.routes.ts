import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Ruta protegida: Primero pasa por verifyToken, si todo va bien, ejecuta getProfile
router.get('/me', verifyToken, getProfile);

export default router;
