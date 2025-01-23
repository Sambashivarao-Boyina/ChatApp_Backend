const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true
    },
    userProfile:{
        type:String,
    },
    about:{
        type:String,
        default:"Hey there I am using Chatter"
    },
    sendRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: "AddRequest"
        }
    ],
    receivedRequests: [
        {
            type:Schema.Types.ObjectId,
            ref:"AddRequest"
        }
    ],
    friends:[
        {
            type:Schema.Types.ObjectId,
            ref:"Friend"
        }
    ],
    fcmToken:{
        type: String,
        default:null
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User;