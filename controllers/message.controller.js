import { Socket } from 'socket.io';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import {io , userSocketMap} from '../socket/socket.js'

export const sendMessage = async (req, res) => {
    try {
        console.log(req.body)
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }


        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = userSocketMap.get(receiverId.toString());

        if (receiverSocketId) {
            console.log(receiverSocketId)
            console.log("emitted")
            io.of("/chat").to(receiverSocketId).emit("newMessage", newMessage.message);
        
        }else{
            console.log("Receiver socket not found");
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }


}


export const getMessages = async (req, res) => {
    try {
       const {id : userToChatId} = req.params;
       const senderId = req.user._id;

       let conservation  = await Conversation.findOne({
        participants : {$all : [userToChatId, senderId]}
       }).populate("messages");

      if (!conservation) {
         return res.status(200).json([]);
      }
       

       res.status(200).json(conservation.messages);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
}
