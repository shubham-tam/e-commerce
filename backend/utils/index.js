import { v4 as uuidv4 } from 'uuid';

export const generateUniqueUUID = () => {
    return uuidv4();
};

export * from './passwords.js';
