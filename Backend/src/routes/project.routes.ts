import { Router } from 'express';
import { createProject, getProjects, updateProject, reviewProject } from '../controllers/project.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, getProjects);
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);

// Ruta exclusiva para que el Administrador valide o rechace un proyecto
router.put('/:id/review', verifyToken, isAdmin, reviewProject);

export default router;
