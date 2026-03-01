import { Router } from 'express';
import { createProject, getProjects, updateProject, reviewProject, updateThumbnail } from '../controllers/project.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, getProjects);
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.put('/:id/review', verifyToken, isAdmin, reviewProject);

// NUEVO: Ruta para guardar la URL de la imagen en el proyecto
router.put('/:id/thumbnail', verifyToken, updateThumbnail);

export default router;
