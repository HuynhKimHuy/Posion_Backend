import express from 'express'
import asyncHandler from '../../middleware/asyncHandler.js';
import { requireAccessToken } from '../../middleware/authHeader.middleware.js';
import UserController from '../../controllers/UserController.js';
const UserRouter = express.Router()

UserRouter.get("/me", requireAccessToken, asyncHandler(UserController.fetchUserInfo));
UserRouter.patch("/me", requireAccessToken, asyncHandler(UserController.updateUserInfo));

export default UserRouter