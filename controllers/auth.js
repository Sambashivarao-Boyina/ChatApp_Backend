const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {OAuth2Client} = require("google-auth-library")


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

module.exports.refreshToken = async (req, res) => {
    const headers = req.headers.authorization
    if(!headers || !headers.startsWith("Bearer ")) {
        return res.status(401).json({message:"You are not Login"})
    }
    
    const tokenFound = headers.split(" ")[1]
    let id;
    jwt.verify(tokenFound, process.env.SECEAT_KEY, async(error,data) => {
        if(error) {
            return res.status(401).json({message: "You are not Login"})
        }
        id = data.id
    });
    
    const user = await User.findById(id);
    if(user == null) {
        return res.status(401).json({message: "You are not Login"})
    }


    const token = jwt.sign({id:user._id}, process.env.SECEAT_KEY, {expiresIn:"7d"});
    
    res.status(200).json({token:token})
}

module.exports.googleSignIn = async(req,res) => {
    const {email, username} = req.body


    const user = await User.findOne({email: email})

    if(user) {
        const token = jwt.sign({id:user._id}, process.env.SECEAT_KEY, {expiresIn:"7d"})

        res.status(200).json({message:"Login successfull",token: token})
    } else {
        const password = generateRandomString(6);

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const uniqueUserName = await getUniqueUserName(username);


        const user = new User({
            email: email,
            username: uniqueUserName,
            password: hashedPassword
        })
        
        const newUser = await user.save();

        const token = jwt.sign({id:newUser._id}, process.env.SECEAT_KEY, {expiresIn:"7d"})

        res.status(200).json({message:"Sign up successfull", token: token})

    }

}

function generateRandomString(len) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

async function getUniqueUserName(userName) {
    let user = await User.findOne({username:userName});
    let newName = userName
    while(user != null) {
        newName = userName + generateRandomString(5);
        user = await User.findOne({userName: newName});
    }

    return newName;
}