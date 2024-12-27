const Friend = require("../models/friend");
const User = require("../models/User")
const { route } = require("../routes/addRequest")




module.exports.getAllUsers = async (req, res) => {
    const user = await User.findById(req.user.id)
                    .populate(path = "friends", select = "person chat _id lastSeen")
                    .populate({
                        path:"friends",
                        populate:{
                            path:"person",
                            select:"username email userProfile about _id"
                        },
                    })

    const userFriendsList = [];
    for(let i = 0; i < user.friends.length ; i++) {
        userFriendsList.push(user.friends[i].person._id)
    }

    userFriendsList.push(user._id)

    const newFriends = await User.find({_id:{$nin:userFriendsList}}, select = "_id username email about userProfile")
                    
    res.status(200).json(newFriends)
}

module.exports.searchUser = async (req, res) => {
    const user = await User.findById(req.user.id)
                    .populate(path = "friends", select = "person chat _id lastSeen")
                    .populate({
                        path:"friends",
                        populate:{
                            path:"person",
                            select:"username email userProfile about _id"
                        },
                    })

    const userFriendsList = [];
    for(let i = 0; i < user.friends.length ; i++) {
        userFriendsList.push(user.friends[i].person._id)
    }

    userFriendsList.push(user._id)

    const searchValue = req.params.searchValue

    const newFriends = await User.find({_id:{$nin:userFriendsList} ,username: { $regex: searchValue, $options: 'i' }}, select = "_id username email about userProfile")
    res.status(200).json(newFriends)
}

module.exports.getMyDetails = async (req,res) => {
    const id = req.user.id;
    const user = await User.findById(id, select = "_id username userProfile email about sendRequests receivedRequests friends ")

    res.status(200).json(user)
}

module.exports.getUserById = async (req, res) => {

    const id = req.params.id
    const user = await User.findById(id, select = "_id username userProfile email about ")

    res.status(200).json(user)
}



module.exports.updateUserAbout = async(req,res) => {
    const {data} = req.body;
    const user = await User.findById(req.user.id)

    if(!user) {
        return res.status(404).json({message:"User Not fount"});
    }
    user.about = data;
    await user.save()
    
    res.status(201).json({message:"About is Updated Successfully"});    
}

module.exports.updateUserProfile = async (req,res)=> {
    if (!req.file) {
        return res.status(400).json({ message: "File is Not uploaded" });
    }

    const user = await User.findById(req.user.id);

    user.userProfile = req.file.path

    await user.save()

    res.status(200).json({ message: "Profile Updated"});
} 