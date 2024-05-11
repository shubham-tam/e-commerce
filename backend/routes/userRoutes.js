import express from 'express';

import {
    registerUser,
    updateUserById,
    getUserById,
    deleteUserById,
} from '../controller/userController/userController.js';

const router = express.Router();

router.put('/:id', updateUserById);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.post('/register-user', registerUser);

export default router;
