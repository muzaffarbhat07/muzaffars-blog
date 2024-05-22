import { Router } from 'express';
const router = Router();
import { test, updateUser, deleteUser, getUsers, getUser } from '../controllers/user.js';
import { verifyToken } from '../utils/verifyUser.js';


router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;