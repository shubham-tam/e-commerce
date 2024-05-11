import dotenv from 'dotenv';

dotenv.config();

export const CHECK_USER_EMAIL_EXISTS = `SELECT * FROM "${process.env.USER_TABLE}" WHERE email = $1`;
