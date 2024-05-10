import express from 'express';

import { registerUser } from '../controller/userController/userController.js';

const router = express.Router();

router.post('/login', registerUser);

export default router;
