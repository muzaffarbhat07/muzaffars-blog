import { Router } from 'express';
const router = Router();
import { test } from '../controllers/user.js';


router.get('/test', test);

export default router;