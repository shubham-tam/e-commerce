import expressAsyncHandler from 'express-async-handler';

import pool from '../../config/db.js';

const registerUser = expressAsyncHandler(async (req, res) => {
    res.status(200).json({ message: 'register user API hit' });
});

export { registerUser };
