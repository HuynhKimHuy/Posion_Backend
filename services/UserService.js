import User from "../models/User.js";
import { AuthFailureError, BadRequestError } from "../core/AppError.js";
import { uploadImageBuffer } from "../middleware/uploadMiddleware.js";

class UserService {
  static fetchUserInfo = async (payload = {}) => {
    const { userId } = payload;
    if (!userId) throw new BadRequestError("Missing userId");

    return await User.findById(userId).select("-passwordHash").lean();
  };

  static updateUserInfo = async (payload = {}) => {
    const { userId, bio, firstName, lastName, userName } = payload;
    if (!userId) throw new BadRequestError("Missing userId");

    const updates = {};

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        throw new BadRequestError("bio must be a string");
      }
      updates.bio = bio.trim();
    }

    if (firstName !== undefined) {
      if (typeof firstName !== "string" || !firstName.trim()) {
        throw new BadRequestError("firstName must be a non-empty string");
      }
      updates.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      if (typeof lastName !== "string" || !lastName.trim()) {
        throw new BadRequestError("lastName must be a non-empty string");
      }
      updates.lastName = lastName.trim();
    }

    if (userName !== undefined) {
      if (typeof userName !== "string" || !userName.trim()) {
        throw new BadRequestError("userName must be a non-empty string");
      }
      updates.userName = userName.trim().toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      throw new BadRequestError("No profile fields provided");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    )
      .select("-passwordHash")
      .lean();

    if (!updatedUser) {
      throw new AuthFailureError("User not found");
    }

    return updatedUser;
  };

  static uploadAvatar = async (payload = {}) => {
    const { userId, file } = payload;
    if (!userId) throw new BadRequestError("Missing userId");
    if (!file) throw new BadRequestError("No file uploaded");
    const result = await uploadImageBuffer(file.buffer, { public_id: `chat-app/avatars/${userId}` });
    const imageUrl = result?.secure_url || result?.url;
    if (!imageUrl) throw new BadRequestError("Upload failed: missing image url");

    console.log("[uploadAvatar] uploaded to Cloudinary:", imageUrl);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: imageUrl },
      { new: true }
    )
      .select("-passwordHash")
      .lean();
    if (!updatedUser) {
      throw new AuthFailureError("User not found");
    }
    console.log("[uploadAvatar] user updated avatarUrl:", updatedUser.avatarUrl);
    return updatedUser;
  }

  static uploadCover = async (payload = {}) => {
    const { userId, file } = payload;
    if (!userId) throw new BadRequestError("Missing userId");
    if (!file) throw new BadRequestError("No file uploaded");
    const result = await uploadImageBuffer(file.buffer, { public_id: `chat-app/covers/${userId}` });
    const imageUrl = result?.secure_url || result?.url;
    if (!imageUrl) throw new BadRequestError("Upload failed: missing image url");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { coverUrl: imageUrl },
      { new: true }
    )
      .select("-passwordHash")
      .lean();
    if (!updatedUser) {
      throw new AuthFailureError("User not found");
    }
    return updatedUser;
  }
}

export default UserService;
