import { Router } from 'express';
import { getUsers, deleteUser } from '../controllers/user.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas: Requieren token válido Y ser administrador
router.get('/', verifyToken, isAdmin, getUsers);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
