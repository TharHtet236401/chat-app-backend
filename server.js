import express from 'express';
import dotenv from 'dotenv';


import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());//middleware to parse the request body as json

app.use('/api/auth', authRoutes);







app.get("*", (req, res) => {
    res.send("404 Not Found");
});

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});