import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 200
    }
}, {
    timestamps: true
})

friendRequestSchema.index(
    { from: 1, to: 1 },
    { unique: true }
);
friendRequestSchema.index(
    {
        from: 1
    }
);
friendRequestSchema.index(
    {
        to: 1
    }
);

const FriendRequestModel = mongoose.model("FriendRequest", friendRequestSchema)

export default FriendRequestModel