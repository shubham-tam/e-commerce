import dotenv from 'dotenv';
import express from 'express';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('API running'));

app.use('/api/users', userRoutes);
app.use('/api/users', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
