import { Router } from 'express';
import { getCommentsByVideo, createComment } from '../controllers/interactionController.js';

const router = Router();

router.get('/:videoId', getCommentsByVideo);
router.post('/', createComment);

export default router;