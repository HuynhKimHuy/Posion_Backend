import mongoose from "mongoose";

const { Schema } = mongoose;

const DOCUMENT_NAME = "User";
const COLECCTION_NAME = "users";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      default: "User",
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },
    
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String
    },
    coverUrl: {
      type: String
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    verfify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    collection: COLECCTION_NAME,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



const User = mongoose.model(DOCUMENT_NAME, userSchema);
export default User;
