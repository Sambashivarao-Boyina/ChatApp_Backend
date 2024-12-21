const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports.userSignUp = async(req, res) => {
    const {email, username,password} = req.body;

    let existingUser = await User.findOne({email:email})
    if(existingUser) {
        return res.status(409).json({message:"Email Already Exist"})
    }

    existingUser = await User.findOne({username:username})

    if(existingUser) {
        return res.status(409).json({message:"UserName Already Exist"})
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser = new User({username:username, email:email, password: hashedPassword});
    
    const savedUser = await newUser.save();

    const token = jwt.sign({id:savedUser._id}, process.env.SECEAT_KEY, {expiresIn:"7d"})

    res.status(201).json({token: token, message: "Sign up successfull"})
  
}

module.exports.userSignIn = async (req, res) => {
    const {email, password} = req.body;
    const userExist = await User.findOne({email})

    if(!userExist) {
        return res.status(404).json({message:"User does't exist"});
    }

    const isCorrect = await bcrypt.compare(password, userExist.password);
   

    if(!isCorrect) {
        return res.status(401).json({message:"password is Incorrect"});
    }

    const token = jwt.sign({id:userExist._id}, process.env.SECEAT_KEY, {expiresIn:"7d"});
    
    res.status(200).json({token:token, message:"Login Successful"});
}