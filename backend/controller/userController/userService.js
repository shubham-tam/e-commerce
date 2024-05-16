import {
    ADD_NEW_USER,
    CHECK_USER_EMAIL_EXISTS,
    DELETE_USER_BY_ID,
    GET_USER_BY_ID,
    INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE,
} from '../../queries/index.js';
import pool from '../../config/db.js';
import { hashPassword } from '../../utils/passwords.js';
import { cloudinary } from '../../config/cloudinary.js';

const checkIfEmailExists = async email => {
    try {
        const emailCheckResults = await pool.query(CHECK_USER_EMAIL_EXISTS, [email]);
        if (emailCheckResults?.rows?.length) {
            return [true, null];
        }
        return [false, null];
    } catch (error) {
        console.error('Error checking email:', error);
        return [null, error];
    }
};

const addUserToDB = async (userData, id) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            email,
            password,
            address,
            phone_number,
            payment_mode,
        } = userData;

        const hashedPassword = password ? await hashPassword(password) : '';

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

        return [true, null];
    } catch (error) {
        console.error('Error adding user:', error);
        return [null, error];
    }
};

const checkIfUserIdExists = async id => {
    try {
        const getUserById = await pool.query(GET_USER_BY_ID, [id]);
        return [getUserById, null];
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return [null, error];
    }
};

const uploadUserPhotoToCloudinary = async (filePath, id) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);

        if (!result || !result.public_id) {
            console.error('Invalid result from Cloudinary upload');
            return [null, new Error('Invalid result from Cloudinary upload')];
        }

        await pool.query(INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE, [result.public_id, id]);

        return [true, null];
    } catch (error) {
        console.error('Error in uploadUserPhotoToCloudinary:', error);
        return [null, error];
    }
};

const getUserByIdService = async id => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(GET_USER_BY_ID, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const filteredData = result.rows.map(result => {
            const { password, ...rest } = result;
            return rest;
        });

        let formData = { ...filteredData?.[0] };

        if (filteredData?.[0]?.image_id) {
            try {
                const imageDetails = await cloudinary.api.resource(filteredData[0].image_id);

                const {
                    asset_id,
                    public_id,
                    format,
                    resource_type,
                    bytes,
                    width,
                    height,
                    url,
                    secure_url,
                } = imageDetails;

                const image_id = {
                    asset_id,
                    public_id,
                    format,
                    resource_type,
                    bytes,
                    width,
                    height,
                    url,
                    secure_url,
                };

                formData.image_id = image_id;
            } catch (error) {
                console.error('Error fetching image details:', error);
            }
        }

        return [formData, null];
    } catch (error) {
        console.error('Error in getUserByIdService:', error);
        return [null, error];
    }
};

const deleteUserByIdService = async id => {
    try {
        await new Promise((resolve, reject) => {
            pool.query(DELETE_USER_BY_ID, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        return [true, null];
    } catch (error) {
        console.error('Error deleting user:', error);
        return [null, error];
    }
};

const updateUserByIdService = async (id, req) => {
    const fieldsToUpdate = req.body;

    try {
        const hasImage = req?.files?.[0]?.path !== '';

        if (hasImage) {
            const [uploadSuccess, uploadError] = await uploadUserPhotoToCloudinary(
                req?.files?.[0]?.path,
                id
            );
            if (uploadError) {
                throw uploadError;
            }
        }

        const updateFields = [];
        const updateValues = [];

        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'image_path') {
                updateFields.push(key);
                updateValues.push(value);
            }
        });

        if (updateFields.length === 0 && !hasImage) {
            throw new Error('No fields to update');
        }

        if (updateFields.length > 0) {
            updateValues.push(id);

            const updateQuery = `
                UPDATE "user" 
                SET ${updateFields.map((field, index) => `"${field}" = $${index + 1}`).join(', ')} 
                WHERE id = $${updateValues.length}
            `;

            await pool.query(updateQuery, updateValues);
        }

        return [true, null];
    } catch (error) {
        console.error('Error updating user:', error);
        return [null, error];
    }
};

export {
    addUserToDB,
    checkIfEmailExists,
    checkIfUserIdExists,
    uploadUserPhotoToCloudinary,
    getUserByIdService,
    deleteUserByIdService,
    updateUserByIdService,
};
