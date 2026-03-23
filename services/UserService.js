import User from "../models/User.js";
import { AuthFailureError, BadRequestError } from "../core/AppError.js";

class UserService {
  static fetchUserInfo = async (payload = {}) => {
    const { userId } = payload;
    if (!userId) throw new BadRequestError("Missing userId");

    return await User.findById(userId).select("-passwordHash").lean();
  };

  static updateUserInfo = async (payload = {}) => {
    const { userId, bio } = payload;
    if (!userId) throw new BadRequestError("Missing userId");

    if (typeof bio !== "string") {
      throw new BadRequestError("bio must be a string");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio: bio.trim() },
      { new: true }
    )
      .select("-passwordHash")
      .lean();

    if (!updatedUser) {
      throw new AuthFailureError("User not found");
    }

    return updatedUser;
  };
}

export default UserService;
