import { Router } from 'express';
import {
  getCarreras,
  createCarrera,
  updateCarrera,
  deleteCarrera,
  getEstados,
  getMunicipios,
} from '../controllers/catalog.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de catálogo requieren sesión.
router.use(verifyToken);

// Carreras: lectura para cualquier usuario autenticado, escritura solo admin.
router.get('/carreras', getCarreras);
router.post('/carreras', isAdmin, createCarrera);
router.put('/carreras/:id', isAdmin, updateCarrera);
router.delete('/carreras/:id', isAdmin, deleteCarrera);

// Estados y municipios (INEGI): solo lectura.
router.get('/estados', getEstados);
router.get('/municipios', getMunicipios);

export default router;
