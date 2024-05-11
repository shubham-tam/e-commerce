import express from 'express';

import { authUser } from '../controller/authController/authController.js';

const router = express.Router();

router.post('/login', authUser);

export default router;
