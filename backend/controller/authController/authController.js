import expressAsyncHandler from 'express-async-handler';

import { matchPassword } from '../../utils/index.js';
import { checkIfEmailExists } from '../../helpers/index.js';

const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req?.body;

    if (email?.trim === '' || password?.trim === '') {
        res.status(400);
        throw new Error('Email or password is possbly empty');
    }

    try {
        const [userEmail, _, emailError] = await checkIfEmailExists(req.body.email);
        if (emailError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userEmail?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const verifyPassword = await matchPassword(password, userEmail?.rows?.[0]?.password);

        if (userEmail?.rows?.length > 0 && verifyPassword) {
            // generate token stuff

            res.status(201).json({
                id: userEmail?.rows?.[0]?.id,
                email: userEmail?.rows?.[0]?.email,
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export { authUser };
