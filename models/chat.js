const mongoose = require("mongoose");
const Friend = require("./friend");
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

chatSchema.post("save", async function () {
  if (this.messages.length > 0) {
    const lastMessageId = this.messages[this.messages.length - 1];

    // Update all Friend documents that reference this chat
    await Friend.updateMany(
      { chat: this._id }, // Find all friends associated with this chat
      { lastMessage: lastMessageId } // Update the lastMessage field
    );
  }
});


const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat