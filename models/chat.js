const mongoose = require("mongoose")
const Schema = mongoose.Schema

const chatSchema = new Schema({
    messages:[
        {
            type:Schema.Types.ObjectId,
            ref:"Message"
        }
    ]
})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat