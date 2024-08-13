import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { tokenFromSocket } from '../utils/generateToken.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    }
});

// At the top of your Socket.IO file
const userSocketMap = new Map();
io.of("/chat").use(async (socket,next)=>{
    console.log("this is within the middleware")
    tokenFromSocket(socket,next)
   
}).on("connection",(socket)=>{
    console.log("this is within the connection")
    socket.emit("welcome",socket.currentUser)
    socket.emit("socketId",socket.id)
    userSocketMap.set(socket.currentUser._id,socket.id)
    

    socket.on("newMessage",(message)=>{
        console.log(message)
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected")
        if(userSocketMap.has(socket.currentUser._id)){
            userSocketMap.delete(socket.currentUser._id)
        }
    })
})

 
io.on("connect_error", (err) => {
    console.error("Connection Error:", err);
});





// io.on("connection", (socket) => {
//     console.log("Socket ID:", socket.id);
//     console.log(socket.handshake);

//     socket.emit("welcome", "Welcome to the chat");

//     // Associate the user ID with the socket ID
//     socket.on('register', (userId) => {
//         userSocketMap.set(userId, socket.id);
//         socket.userId = userId; // Store userId in socket for easy access
//     });

//     socket.on("disconnect", () => {
//         console.log("User Disconnected");
//         if (socket.userId) {
//             userSocketMap.delete(socket.userId);
//         }
//     });
// });




export { app, io, server , userSocketMap };