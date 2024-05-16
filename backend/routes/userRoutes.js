import express from 'express';

import {
    registerUser,
    updateUserById,
    getUserById,
    deleteUserById,
} from '../controller/userController/userController.js';
import { upload } from '../middleware/multer.js';
import { checkSingleFile } from '../utils/index.js';

const router = express.Router();

router.put('/:id', upload.any(), checkSingleFile, updateUserById);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.post('/register-user', upload.any(), checkSingleFile, registerUser);

export default router;
