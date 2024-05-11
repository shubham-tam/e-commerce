import expressAsyncHandler from 'express-async-handler';

import {
    ADD_NEW_USER,
    GET_USER_BY_ID,
    DELETE_USER_BY_ID,
    CHECK_USER_EMAIL_EXISTS,
} from './userQueries.js';
import pool from '../../config/db.js';
import { generateUniqueUUID, hashPassword } from '../../utils/index.js';

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

        if (emailCheckResults?.rows?.length) {
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

const updateUserById = expressAsyncHandler(async (req, res) => {
    const id = req?.params?.id;

    const fieldsToUpdate = req.body;

    try {
        const checkIfUserExits = await pool.query(GET_USER_BY_ID, [id]);

        if (checkIfUserExits?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const updateFields = [];
        const updateValues = [];

        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id') {
                updateFields.push(key);
                updateValues.push(value);
            }
        });

        updateValues.push(id);

        const updateQuery = `
            UPDATE "user" 
            SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ')} 
            WHERE id = $${updateValues.length}
        `;

        await pool.query(updateQuery, updateValues);

        return res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const getUserById = expressAsyncHandler(async (req, res) => {
    const id = req?.params?.id;

    try {
        pool.query(GET_USER_BY_ID, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const filteredData = results.rows.map(result => {
                const { password, ...rest } = result;
                return rest;
            });

            res.status(200).json({ data: filteredData?.[0] });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const deleteUserById = expressAsyncHandler(async (req, res) => {
    const id = req?.params?.id;

    try {
        pool.query(DELETE_USER_BY_ID, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'User deletion successfull' });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export { registerUser, updateUserById, getUserById, deleteUserById };
