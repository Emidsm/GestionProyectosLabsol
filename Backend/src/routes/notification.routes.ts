import { Router } from 'express';
import { getMyNotifications, markNotificationsAsRead, markOneNotificationAsRead } from '../controllers/notification.controller';
// Cambiamos authenticateToken por verifyToken (o el nombre exacto que tengas en tu middleware)
import { verifyToken } from '../middlewares/auth.middleware'; 

const router = Router();

// Aquí es donde estaba tronando porque recibía 'undefined'
router.use(verifyToken);

router.get('/', getMyNotifications);
router.patch('/read-all', markNotificationsAsRead);
router.patch('/:id/read', markOneNotificationAsRead);

export default router;
