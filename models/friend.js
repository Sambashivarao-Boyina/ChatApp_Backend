const mongoose = require("mongoose")
const Schema = mongoose.Schema

const friendSchema = new Schema({
    person: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    lastSeen:{
        type:Date,
        default: Date.now()
    }
})

const Friend = mongoose.model("Friend",friendSchema)
module.exports = Friend