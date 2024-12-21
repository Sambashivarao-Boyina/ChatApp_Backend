const User = require("../models/User")
const AddRequest = require("../models/addRequest")


module.exports.sendRequest = async (req, res) => {

    const senderId = req.user.id
    const receiverId = req.params.id

    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)

    
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


module.exports.userAllRequests = async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId)
            .populate({
                path: "sendRequests",
                populate: {
                    path: "receiver", // Populate receiver details in each request
                    select:"username email userProfile about"
                },
            })
            .populate({
                path: "receivedRequests",
                populate: {
                    path: "sender", // Populate sender details in each request
                },
                select:"username email userProfile about"
            });

    console.log(user);

    res.status(200).json({sendRequests:user.sendRequests, receivedRequests:user.receivedRequests})
}