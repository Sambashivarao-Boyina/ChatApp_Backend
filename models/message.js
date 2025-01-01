const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    imageUrl: {
        type:String,
        default:null
    },
    message: {
        type:"String",
        required:true,
        default:""
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
})

const Message = mongoose.model("Message",messageSchema)

module.exports = Message