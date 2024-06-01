import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, getCommentsOfPost, likeComment, editComment, deleteComment, getAllComments } from '../controllers/comment.js';

const router = express.Router();


router.post('/create', verifyToken, createComment);
router.get('/getComments/:postId', getCommentsOfPost);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getComments', verifyToken, getAllComments);

export default router;