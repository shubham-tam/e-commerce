import expressAsyncHandler from 'express-async-handler';

import pool from '../../config/db.js';
import { generateUniqueUUID, hashPassword } from '../../utils/index.js';
import { ADD_NEW_USER, CHECK_USER_EMAIL_EXISTS } from './userQueries.js';

const registerUser = expressAsyncHandler(async (req, res) => {
    const {
        first_name,
        middle_name,
        last_name,
        email,
        password,
        address,
        phone_number,
        payment_mode,
    } = req.body;

    try {
        const emailCheckResults = await pool.query(CHECK_USER_EMAIL_EXISTS, [email]);
        if (emailCheckResults.rows.length) {
            return res.status(400).send('Email already exists');
        }

        const id = generateUniqueUUID();
        const hashedPassword = await hashPassword(password);

        await pool.query(ADD_NEW_USER, [
            id,
            first_name,
            middle_name,
            last_name,
            email,
            hashedPassword,
            address,
            phone_number,
            payment_mode,
        ]);

        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export { registerUser };
