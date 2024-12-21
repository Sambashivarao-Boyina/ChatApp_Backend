const mongoose = require("mongoose")
const Schema = mongoose.Schema

const friendSchema = new Schema({
    person: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    isBlocked: {
        type:Boolean,
        default:false
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    }
})

const Friend = mongoose.model("Friend",friendSchema)
module.exports = Friend