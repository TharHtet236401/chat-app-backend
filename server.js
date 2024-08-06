import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/auth.routes.js';

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get("*", (req, res) => {
    res.send("404 Not Found");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});