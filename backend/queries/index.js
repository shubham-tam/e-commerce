const CHECK_USER_EMAIL_EXISTS = `SELECT * FROM "user" WHERE email = $1`;

const ADD_NEW_USER = `INSERT INTO "user" (id, first_name, middle_name, last_name, email, password, address, phone_number, payment_mode) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

const GET_USER_BY_ID = `SELECT * FROM "user" WHERE id = $1`;

const DELETE_USER_BY_ID = `DELETE FROM "user" where id = $1`;

const INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE = `UPDATE "user" SET image_id = $1 where id = $2`;

export {
    ADD_NEW_USER,
    CHECK_USER_EMAIL_EXISTS,
    GET_USER_BY_ID,
    DELETE_USER_BY_ID,
    INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE,
};
