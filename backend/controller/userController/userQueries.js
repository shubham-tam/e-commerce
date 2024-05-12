import dotenv from 'dotenv';

import { CHECK_USER_EMAIL_EXISTS } from '../../queries/commonQueries.js';

dotenv.config();

const ADD_NEW_USER = `INSERT INTO "${process.env.USER_TABLE}" (id, first_name, middle_name, last_name, email, password, address, phone_number, payment_mode) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

const GET_USER_BY_ID = `SELECT * FROM "${process.env.USER_TABLE}" WHERE id = $1`;

const DELETE_USER_BY_ID = `DELETE FROM "${process.env.USER_TABLE}" where id = $1`;

const INSERT_IMAGE_DATA_USER_TABLE = `UPDATE "${process.env.USER_TABLE}" SET image = $1 where id = $2`;

export {
    ADD_NEW_USER,
    CHECK_USER_EMAIL_EXISTS,
    GET_USER_BY_ID,
    DELETE_USER_BY_ID,
    INSERT_IMAGE_DATA_USER_TABLE,
};
