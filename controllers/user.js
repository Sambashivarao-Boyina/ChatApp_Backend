const User = require("../models/User")


module.exports.getAllUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
}

module.exports.getUserById = async (req, res) => {

    const id = req.params.id
    const user = await User.findById(id)



    res.status(200).json(user)
}