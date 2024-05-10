import express from 'express';

import { registerUser } from '../controller/userController/userController.js';

const router = express.Router();

router.post('/register-user', registerUser);

export default router;
