const jwt = require("jsonwebtoken")

module.exports.verifyUser = async(req, res, next) => {
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

    if(id == null) {
        return res.status(401).json({message: "You are not Login"})
    }

    req.user = {
        id : id
    }
    next()
}



module.exports.getUserIdFromToken = (token)=> {

    let id;
    jwt.verify(token, process.env.SECEAT_KEY, async(error,data) => {
        id = data.id
    });


    return id;
}