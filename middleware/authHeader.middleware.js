
import { AuthFailureError } from "../core/AppError.js";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const requireAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new AuthFailureError("Missing authorization header");

    const token = authHeader.split(' ')[1]
    if (!token) throw new AuthFailureError("Missing authorization header");

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("✅ [AUTH] Token verified successfully, userId:", decodedUser.userId);
    } catch (jwtError) {
      console.error("❌ [AUTH] JWT Verification Error:", jwtError.message);
      throw new AuthFailureError(`JWT Error: ${jwtError.message}`);
    }

    const user = await User.findById(decodedUser.userId).select("-passwordHash");
    if (!user) throw new AuthFailureError("User not found");

      console.log("✅ [AUTH] User found:", user._id);
    req.user = user;

    next()
  } catch (error) {
    console.error("❌ [AUTH] Auth middleware error:", error.message);
    next(error);
  }
}
