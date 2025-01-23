const Friend = require("../models/friend");
const User = require("../models/user")
const bcrypt = require("bcryptjs")




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

module.exports.getActiveUsers = async(req,res) => {
    const socketStore = req.socketStore
    const users = Object.keys(socketStore.getAllUsers()); 
  
    res.status(200).json(users);
}   

module.exports.saveFcmToken = async(req, res) => {
    const fcmToken = req.body.data;
    

    const user = await User.findById(req.user.id);
    if(user == null) {
        return res.status(400).json({message:"user not login"})
    }

    user.fcmToken = fcmToken
    await user.save()



    res.status(200).json({message:"message received"});
}

module.exports.deleteFcmToken = async(req,res)=> {
    const user = await User.findById(req.user.id);
     if(user == null) {
        return res.status(400).json({message:"user not login"})
    }

    user.fcmToken = null;
    await user.save();

    res.status(200).json({message:"token deleted"});
}

module.exports.updateUsername = async(req,res)=>{
    const username = req.body.data;

    const user = await User.findById(req.user.id);

    const userNameAlreadyExist = await User.findOne({username: username});


    if(userNameAlreadyExist) {
        return res.status(404).json({message:"User Name alredy exist, Try another"});
    } else if(username.length < 5) {
        return res.status(404).json({message:"Username should contain atleast 6 characters"})
    }

    user.username = username
    await user.save()


    res.status(200).json({ message: "UserName Updated"});
}

module.exports.updatePassword = async(req, res) => {
    const password = req.body.data

    if(password.trim().length <= 8) {
        return res.status(202).json({message:"Password length is too small"})
    } 
    
    const user = await User.findById(req.user.id);

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    user.password = hashedPassword

    await user.save();


    res.status(200).json({message:"password updated successfully"});
    
}