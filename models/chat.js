const mongoose = require("mongoose")
const Schema = mongoose.Schema

const chatSchema = new Schema({

    messages:[
        {
            type:Schema.Types.ObjectId,
            ref:"Message"
        }
    ],
    blockedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat