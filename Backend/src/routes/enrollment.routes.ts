import { Router } from 'express';
import { enrollInProject, getProjectEnrollments, forceEnrollStudent, reviewEnrollment } from '../controllers/enrollment.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, enrollInProject);
router.post('/force', verifyToken, isAdmin, forceEnrollStudent);
router.get('/project/:projectId', verifyToken, getProjectEnrollments);

// NUEVO: Administrador evalúa una inscripción específica
router.put('/:id/review', verifyToken, isAdmin, reviewEnrollment);

export default router;
