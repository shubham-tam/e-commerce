import expressAsyncHandler from 'express-async-handler';

import pool from '../../config/db.js';
import { matchPassword } from '../../utils/index.js';
import { CHECK_USER_EMAIL_EXISTS } from './authQueries.js';

const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req?.body;

    if (email?.trim === '' || password?.trim === '') {
        res.status(400);
        throw new Error('Email or password is possbly empty');
    }

    try {
        const loggedInUser = await pool.query(CHECK_USER_EMAIL_EXISTS, [email]);

        if (loggedInUser?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const verifyPassword = await matchPassword(password, loggedInUser?.rows?.[0]?.password);

        if (loggedInUser && verifyPassword) {
            // generate token stuff

            res.status(201).json({
                id: loggedInUser?.rows?.[0]?.id,
                email: loggedInUser?.rows?.[0]?.email,
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export { authUser };
