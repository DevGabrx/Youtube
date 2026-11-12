import { Router } from 'express';
import { 
  getMyProfile, 
  updateMyProfile, 
  deleteMyAccount, 
  getAllUsers, 
  deleteUserByAdmin 
} from '../controllers/userController.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas las rutas aquí requieren autenticación mínima
router.use(verifyToken);

// Rutas de Usuario Estándar (/api/users/me)
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.delete('/me', deleteMyAccount);

// Rutas de Administración (/api/users/)
router.get('/', requireAdmin, getAllUsers);
router.delete('/:id', requireAdmin, deleteUserByAdmin);

export default router;