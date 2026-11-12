import { Router } from 'express';
import { getVideos, createVideo, deleteVideo } from '../controllers/videoController.js';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Feed público: No requiere token
router.get('/', getVideos);

// Subir video: Requiere estar logueado (cualquier rol)
router.post('/', verifyToken, createVideo);

// Eliminar video: Requiere estar logueado y ser Admin
router.delete('/:id', verifyToken, requireAdmin, deleteVideo);

export default router;