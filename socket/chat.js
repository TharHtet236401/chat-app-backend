

export const liveUser = async( socketId,user) =>{
    user ['socketId'] = socketId;
    await Redis.setObj(socketId,user._id);
    await Redis.setObj(user._id,user);
    
}

export const initialize = async(io, socket) =>{
    socket.emit("greet",{"name":socket.data.name,"id":socket.data._id})
    socket.emit ("socketId",socket.id)
    socket['currentUserId'] = socket.data._id;
    liveUser(socket.id,socket.data)
    socket.on('unread',(data)=> sendUnreadMsg(socket));
    socket.on ('message',(data)=> incomingMessage(socket,data,io))
    socket.on('load-more',(data)=> loadMore(socket,data,io))
}

export const sendUnreadMsg = async(socket) =>{
    let unreads = await UnReadTB.find({to:socket.currentUserId});
    console.log(unreads.length)
    if (unreads.length > 0){
        for (let unread of unreads){
            await UnReadTB.findOneAndDelete(unread._id);
        }
    }
  
    socket.emit ("unread", {unreads:unreads.length})
}

export const incomingMessage = async(socket,message,io) =>{
    
    let msg = await new MessageTB(message).save();
    let msgResult = await MessageTB.findById(msg._id).populate('from').populate('to');
    let toUser =await Redis.getObj(message.to);
  
    
    if(toUser){
       let toSocket = io.of("/chat").sockets.get(toUser.socketId);
       if(toSocket){
        toSocket.emit("message",msg)
       }else{
        await new UnReadTB({from:message.from,to:message.to}).save();
       }
    }else{
        await new UnReadTB({from:message.from,to:message.to}).save();
    }
    
   
    
    
}

export const loadMore = async(socket,data,io) =>{
    let limit = Number(process.env.MSG_LIMIT);
    let skip = data.page == 0?0:Number(data.page)*limit;
    let messages = await MessageTB.find({
        $or :[{from:socket.currentUserId,},{to:socket.currentUserId}]
    }).sort({created:-1}).skip(skip).limit(limit).populate('from to','name _id');
    socket.emit("message",messages)
}

