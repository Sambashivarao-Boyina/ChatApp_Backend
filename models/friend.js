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
    lastMessage:{
        type: Schema.Types.ObjectId,
        ref:"Message",
        default: null
    }
})



const Friend = mongoose.model("Friend",friendSchema)
module.exports = Friend