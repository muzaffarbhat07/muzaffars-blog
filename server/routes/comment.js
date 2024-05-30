import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, getComments, likeComment, editComment } from '../controllers/comment.js';

const router = express.Router();


router.post('/create', verifyToken, createComment);
router.get('/getComments/:postId', getComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);

export default router;