import { Router } from 'express';
import { getProfile, updateAvatar, updateProfile, getAllUsers, getUserById, deleteUser } from '../controllers/user.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);       // NUEVO: editar perfil propio
router.put('/avatar', verifyToken, updateAvatar);
router.get('/', verifyToken, isAdmin, getAllUsers);        // NUEVO: lista todos (solo admin)
router.get('/:id', verifyToken, isAdmin, getUserById);     // NUEVO: detalle (solo admin)
router.delete('/:id', verifyToken, isAdmin, deleteUser);   // NUEVO: eliminar (solo admin)

export default router;
