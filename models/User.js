import mongoose from "mongoose";

const { Schema } = mongoose;

const DOCUMENT_NAME = "user";
const COLECCTION_NAME = "users";

const userSchema = new mongoose.Schema(
  {
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

    userName: {
      type: String,
      default: "User",
      trim: true,
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
  { timestamps: true, collection: COLECCTION_NAME }
);

const User = mongoose.model(DOCUMENT_NAME, userSchema);
export default User;
