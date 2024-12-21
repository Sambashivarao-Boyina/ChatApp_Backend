const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender:{
        type:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    message: {
        type:"String",
        required:true
    },
    
}, {
    timestamps:true
})

const Message = mongoose.model("Message",messageSchema)

module.exports = Message