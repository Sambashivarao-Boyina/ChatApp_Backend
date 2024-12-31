const { request } = require("express");
const Friend = require("../models/friend");
const Message = require("../models/message");
const User = require("../models/User");
const Chat = require("../models/chat");

module.exports.getAllFriends = async (req, res) => {
    const user = await User.findById(req.user.id)
            .populate(path = "friends", select = "person chat _id lastSeen")
            .populate({
                path:"friends",
                populate:{
                    path:"person",
                    select:"username email userProfile about _id"
                },
            })
            .populate({
                path:"friends",
                populate:{
                    path:"lastMessage"
                }
            })

 
    

    res.status(200).json(user.friends);
}

module.exports.searchFriend = async(req, res) => {
    const searhValue = req.params.searchValue
    const user = await User.findById(req.user.id)
            .populate(path = "friends", select = "person chat _id lastSeen")
            .populate({
                path:"friends",
                populate:{
                    path:"person",
                    select:"username email userProfile about _id"
                },
            })
            .populate({
                path:"friends",
                populate:{
                    path:"lastMessage"
                }
            })

 
    

    res.status(200).json(user.friends);
}


module.exports.getFriend = async(req, res) => {
    const user = await User.findById(req.user.id)
    const friendId = req.params.id;

    if(user.friends.indexOf(friendId) == -1) {
        return res.status(400).json({message:"Friend Not found"})
    }
    

    const friend = await Friend.findById(friendId)
                    .populate("person", select = "_id username userProfile email about")
                    .populate("lastMessage")


    res.status(200).json(friend)
}

module.exports.getChat = async(req, res) => {
    const user = await User.findById(req.user.id)
                    .populate("friends");

    const chatId = req.params.id;
   
    let isContainChat = user.friends.some((friend)=> {
        return friend.chat.equals(chatId);
    })

    if(!isContainChat) {
        return res.status(400).json({message:"Chat not found"});
    }

    const chat = await Chat.findById(chatId)
                .populate("blockedBy")
                .populate("messages")
  

    res.status(200).json(chat);
}


module.exports.sendMessage = async(req, res) => {
    const user = await User.findById(req.user.id)
    const friendId = req.params.id;
    const io = req.io;

    if(user.friends.indexOf(friendId) == -1) {
        return res.status(400).json({message:"Friend Not found"})
    }

    const {message} = req.body;

    const newMessage = await Message({sender:user._id, message:message});
    const savedMessage = await newMessage.save();

    let friend = await Friend.findById(friendId)
                    .populate("person", select = "_id username userProfile email about")
                    .populate("chat")
                    .populate({
                        path:"chat",
                        populate:{
                            path:"messages"
                        }
                    })
            

    let chat = await Chat.findById(friend.chat._id)

    if(chat.blockedBy !== null) {
        return res.status(404).json({message:"Chat has been blocked you cannot send message"})
    }

    chat.messages.push(savedMessage._id)
    await chat.save();

    friend.lastMessage = savedMessage.id
    await friend.save();

    const receiverScoketID = req.socketStore.getSocketOfUser(friend.person._id);
    
    io.to(receiverScoketID).emit("message_received","message");

    chat = await Chat.findById(friend.chat._id)
                .populate("blockedBy")
                .populate("messages");

    res.status(200).json(chat)
}

module.exports.blockUser = async (req, res) => {
    const friend = await Friend.findById(req.params.id)
                                .populate("person")

    const io = req.io;


    let chat = await Chat.findById(friend.chat);

    

    if(chat.blockedBy != null) {
        return res.status(400).json({message:"User has already blocked"})
    }

    chat.blockedBy = req.user.id

    await chat.save()

    chat = await Chat.findById(friend.chat._id)
                .populate("blockedBy")
                .populate("messages");

    const receiverScoketID = req.socketStore.getSocketOfUser(friend.person._id)
    io.to(receiverScoketID).emit("chat_updated", "chat has been blocked")

    res.status(200).json(chat)
}


module.exports.unblockUser = async(req, res) => {
    const friend = await Friend.findById(req.params.id)
                                        .populate("person");

    const io = req.io;

    let chat = await Chat.findById(friend.chat)
    .populate("blockedBy");


    

    if(chat.blockedBy == null) {
        return res.status(400).json({message:"User has not blocked"})
    }

    if(chat.blockedBy._id != req.user.id) {
        return res.status(404).json({message:"you cannot unblock the user"});
    }

    chat.blockedBy = null

    await chat.save()

    chat = await Chat.findById(friend.chat._id)
                .populate("blockedBy")
                .populate("messages");

    const receiverScoketID = req.socketStore.getSocketOfUser(friend.person._id)
    io.to(receiverScoketID).emit("chat_updated", "chat has been unblocked")


    res.status(200).json(chat)
}