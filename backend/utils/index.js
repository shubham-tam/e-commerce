import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const generateUniqueUUID = () => {
    return uuidv4();
};

export const hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
