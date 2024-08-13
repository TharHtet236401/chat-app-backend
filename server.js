import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './db/connectToMongoDB.js';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import {app,io,server} from './socket/socket.js'

const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(cookieParser())//

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

io.of("/chat").use(async (socket,next)=>{
    console.log("this is within the middleware")
    const token = socket.handshake
    console.log(token)
   next()
}).on("connection",(socket)=>{
    console.log("this is within the connection")
})

 
io.on("connect_error", (err) => {
    console.error("Connection Error:", err);
});




app.get("*", (req, res) => {
    res.send("404 Not Found");
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});