const mongoose = require("mongoose")
const User = require("../models/User")
const AddRequest = require("../models/addRequest")
const Chat = require("../models/chat")
const Friend = require("../models/friend")


module.exports.sendRequest = async (req, res) => {

    const senderId = req.user.id
    const receiverId = req.params.id

    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)

    console.log("Received request");
    
    if(!sender) {
        res.status(404).json({message:"User Not found"})
    }

    if(!receiver) {
        res.status(404).json({message:"request User not found"})
    }

   
    if(senderId === receiverId) {
        res.status(404).json({message:"You cannot follow your self"});
    }

    // Create a new request object
    const newRequest = new AddRequest({
        sender: sender._id,
        receiver: receiver._id
    })

    const saveRequest = await newRequest.save()
    sender.sendRequests.push(saveRequest._id)
    receiver.receivedRequests.push(saveRequest.id)

    await sender.save();
    await receiver.save()

    res.status(202).json({message:"Request has been Send"})
}


module.exports.getUserReceivedRequests = async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId)
            .populate({
                path: "receivedRequests",
                populate: {
                    path: "receiver", // Populate sender details in each request
                    select:"username email userProfile about _id"
                },
            })
            .populate({
                path: "receivedRequests",
                populate: {
                    path: "sender", // Populate sender details in each request
                    select:"username email userProfile about _id"
                },
            });

    



    res.status(200).json(user.receivedRequests)
}


module.exports.getUserSendRequests = async(req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId)
            .populate({
                path: "sendRequests",
                populate: {
                    path: "receiver", // Populate receiver details in each request
                    select:"username email userProfile about _id"
                },
            })
            .populate({
                path: "sendRequests",
                populate: {
                    path: "sender", // Populate sender details in each request
                    select:"username email userProfile about _id"
                },
            })

    res.status(200).json(user.sendRequests)
}


module.exports.rejectRequest = async (req, res) => {
    const userId = req.user.id;
    const addRequestId = req.params.id;

    const user = await User.findOne({_id:userId,receivedRequests: { $in: [addRequestId] } })

    if(!user) {
        return res.status(401).json({message:"You haven't received the request"});
    }

    const request = await AddRequest.findById(addRequestId)

    if(request.status == "Accepted") {
        return res.status(409).json({message:"Already Updated"})
    }

    request.status = "Rejected"

    await request.save();

    res.status(200).json({message:"Rejected"})
}

module.exports.acceptRequest = async (req, res) => {
    const userId = req.user.id;
    const addRequestId = req.params.id;


    let user = await User.findOne({_id:userId,receivedRequests: { $in: [addRequestId] } }).populate("friends")

    if(!user) {
        return res.status(401).json({message:"You haven't received the request"});
    }

    const request = await AddRequest.findById(addRequestId)


    const isAlreadyFriend = user.friends.some((friend) => {
        return friend.person.equals(request.sender)
    })


    if(isAlreadyFriend) {
        return res.status(409).json({message:"This Person is Already your friend"});
    }

    if(request.status !== "Pending") {
        return res.status(409).json({message:"Already Updated"})
    }


    request.status = "Accepted"
    await request.save();

    const sender = await User.findById(request.sender)

    const chat = await new Chat().save();

    let userFriend = new Friend({
        person: sender._id,
        chat: chat._id
    })

    userFriend = await userFriend.save();

    let senderFriend = new Friend({
        person: user._id,
        chat:chat._id
    })

    senderFriend = await senderFriend.save();
    
    user.friends.push(userFriend._id);
    sender.friends.push(senderFriend._id)



    await user.save()
    await sender.save()


    res.status(200).json({message:"Accepted"})
}






