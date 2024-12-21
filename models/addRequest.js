const mongoose = require("mongoose")
const Schema = mongoose.Schema

const addRequestSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true

    },
    status:{
        type:String,
        enum:["Pending","Rejected","Accepted"],
        default:"Pending"
    }
}, {
    timestamps:true
})

const AddRequest = mongoose.model("AddRequest",addRequestSchema)

module.exports = AddRequest