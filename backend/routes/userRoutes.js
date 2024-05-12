import express from 'express';

import {
    registerUser,
    updateUserById,
    getUserById,
    deleteUserById,
} from '../controller/userController/userController.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.put('/:id', updateUserById);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.post('/register-user', upload.any(), registerUser);

export default router;
