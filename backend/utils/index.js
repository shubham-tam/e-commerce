import { v4 as uuidv4 } from 'uuid';

export const generateUniqueUUID = () => {
    return uuidv4().replace(/-/gi, '');
};

export const checkSingleFile = (req, res, next) => {
    if (req.files && req.files.length > 1) {
        return res.status(400).json({ error: 'Only one file can be uploaded at a time' });
    }
    next();
};

export * from './passwords.js';
