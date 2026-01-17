import User from "../models/User.js";
import bcrypt from "bcrypt";
import { AuthFailureError, BadRequestError, ConflictRequestError } from "../core/AppError.js";
import jwt from "jsonwebtoken";
import FindByEmail from "./findEmailBy.js";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

class AccessService {
  static signup = async (payload = {}) => {
    const { email, password, userName } = payload;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const checkEmail = await FindByEmail(email);
    console.log(checkEmail);
    if (checkEmail) {
      throw new ConflictRequestError("Email exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash,
      userName,
    });
    return newUser;
  };

  static signin = async (payload = {}) => {
    const { email, password } = payload;
    const user = await FindByEmail(email);
    if (!user) throw new BadRequestError("Forbiden Eror");

    const matchPassword = await bcrypt.compare(password, user.passwordHash);
    if (!matchPassword) throw new AuthFailureError("Invalid credentials");

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });

    const refreshToken = crypto.randomBytes(64).toString("hex");

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

    await Session.create({
      user: user._id,
      refreshToken,
      accessToken,
      userAgent: payload.userAgent,
      ipAddress: payload.ipAddress,
      expiresAt,
    });


    return {
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        roles: user.roles,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresAt,
      },
    };
  };

  static logout = async (payload = {}) => {
    const { token } = payload
     if (!token) throw new BadRequestError("Missing refresh token");
    await Session.deleteOne({ refreshToken: token });
  }
}

export default AccessService;
