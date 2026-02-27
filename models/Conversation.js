import mongoose from "mongoose";

// Participant (người tham gia)
const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Group info (chỉ dùng khi type = "group")
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false }
);

// Cache tin nhắn cuối
const lastMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId, // messageId thường là ObjectId
      required: true,
    },
    content: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

// Conversation
const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },

    participants: {
      type: [participantSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length >= 2;
        },
        message: "Conversation must have at least 2 participants.",
      },
    },

    // Chỉ có khi type = group
    group: {
      type: groupSchema,
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    // Ai đã xem lastMessage (tuỳ bạn dùng cho seen trạng thái nào)
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },

    // Map<userId, unreadCount>
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Index để query theo user + sort theo lastMessageAt
conversationSchema.index({
  "participants.userId": 1,
  lastMessageAt: -1,
});

export default mongoose.model("Conversation", conversationSchema);
