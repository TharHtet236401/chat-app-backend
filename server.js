import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './db/connectToMongoDB.js';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(cookieParser())//

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);








app.get("*", (req, res) => {
    res.send("404 Not Found");
});

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});