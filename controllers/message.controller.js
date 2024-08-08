import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
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
