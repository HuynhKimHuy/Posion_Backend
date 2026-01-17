
import { AuthFailureError } from "../core/AppError.js";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const requireAccessToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) throw new AuthFailureError("Missing authorization header");

  const token = authHeader.split(' ')[1]
  if (!token) throw new AuthFailureError("Missing authorization header");

  let decodedUser;
  try {
    decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new AuthFailureError("Invalid or expired token");
  }

  const user = await User.findById(decodedUser.userId).select("-passwordHash");
  if (!user) throw new AuthFailureError("User not found");

  req.user = user;

  next()
}