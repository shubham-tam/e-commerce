import expressAsyncHandler from 'express-async-handler';

import {
    addUserToDB,
    checkIfEmailExists,
    checkIfUserIdExists,
    deleteUserByIdService,
    getUserByIdService,
    updateUserByIdService,
    uploadUserPhotoToCloudinary,
} from './userService.js';
import { generateUniqueUUID } from '../../utils/index.js';

const registerUser = expressAsyncHandler(async (req, res) => {
    try {
        const id = generateUniqueUUID();

        const [emailExists, emailError] = await checkIfEmailExists(req.body.email);
        if (emailError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (emailExists) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const [addUserSuccess, addUserError] = await addUserToDB(req.body, id);
        if (addUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const [getUserResult, getUserError] = await checkIfUserIdExists(id);
        if (getUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (getUserResult?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        if (getUserResult?.rows?.length >= 1 && req?.files?.[0]?.path) {
            const [uploadSuccess, uploadError] = await uploadUserPhotoToCloudinary(
                req.files[0].path,
                id
            );
            if (uploadError) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (uploadSuccess) {
                return res.status(201).send('User created successfully');
            }
        } else {
            return res.status(201).send('User created successfully');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const updateUserById = expressAsyncHandler(async (req, res) => {
    const id = req?.params?.id;

    try {
        const [checkIfUserExits, checkUserError] = await checkIfUserIdExists(id);
        if (checkUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (checkIfUserExits?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const [updateSuccess, updateError] = await updateUserByIdService(id, req);
        if (updateError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

const getUserById = expressAsyncHandler(async (req, res) => {
    const id = req?.params?.id;

    const [data, error] = await getUserByIdService(id);

    if (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ data });
});

const deleteUserById = expressAsyncHandler(async (req, res) => {
    const id = req?.params?.id;

    const [success, error] = await deleteUserByIdService(id);

    if (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (success) {
        res.status(200).json({ message: 'User deletion successful' });
    }
});

export { registerUser, updateUserById, getUserById, deleteUserById };
