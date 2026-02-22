import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        require: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    content: {
        type: String,
        trim: true
    },
    imgUrl: {
        type: String
    },

}, {
    timestamps: true
}
)

messageSchema.index({ conversation: 1, createdAt: -1 })

const message = mongoose.model("Message", messageSchema)

export default message