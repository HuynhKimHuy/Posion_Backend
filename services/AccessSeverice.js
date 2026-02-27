import User from "../models/User.js";
import bcrypt from "bcrypt";
import { AuthFailureError, BadRequestError, ConflictRequestError } from "../core/AppError.js";
import jwt from "jsonwebtoken";
import FindByEmail from "./findEmailBy.js";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

const getAccessTokenSecret = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not set");
  }
  return secret;
};
class AccessService {
  static signup = async (payload = {}) => {
    const { email, password, userName, firstName, lastName } = payload;

    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestError("Email, password, firstName, lastName are required");
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
      firstName,
      lastName,
    });
    return newUser;
  };

  static signin = async (payload = {}) => {
    const { email, password } = payload;
    const user = await FindByEmail(email);
    if (!user) throw new BadRequestError("Forbiden Eror");

    const matchPassword = await bcrypt.compare(password, user.passwordHash);
    if (!matchPassword) throw new AuthFailureError("Invalid credentials");

    const accessToken = jwt.sign({ userId: user._id }, getAccessTokenSecret(), {
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
    const { token } = payload;
    if (!token) throw new BadRequestError("Missing refresh token");
    await Session.deleteOne({ refreshToken: token });
  }

  static refreshToken = async (payload = {}) => {
    const { token } = payload;
    if (!token) throw new BadRequestError("Missing refresh token");

    const session = await Session.findOne({ refreshToken: token, isValid: true });

    if (!session) throw new AuthFailureError("Invalid refresh token");
    
    if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
      await Session.deleteOne({ _id: session._id });
      throw new AuthFailureError("Refresh token expired");
    }

    const user = await User.findById(session.user);
    if (!user) throw new AuthFailureError("User not found");

    const accessToken = jwt.sign({ userId: user._id }, getAccessTokenSecret(), {
      expiresIn: ACCESS_TOKEN_TTL,
    });

    await Session.updateOne({ _id: session._id }, { accessToken });

    return {
      tokens: {
        accessToken
      },
    };
  }
}

export default AccessService;
