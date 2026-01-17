import mongoose from "mongoose";

const { Schema } = mongoose;

const DOCUMENT_NAME = "session";
const COLLECTION_NAME = "sessions";

const SessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

const Session = mongoose.model(DOCUMENT_NAME, SessionSchema);

export default Session;
