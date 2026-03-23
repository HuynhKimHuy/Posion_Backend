import express from 'express'
import asyncHandler from '../../middleware/asyncHandler.js';
import { requireAccessToken } from '../../middleware/authHeader.middleware.js';
import UserController from '../../controllers/UserController.js';
import { upload } from '../../middleware/uploadMiddleware.js';
import router from '../index.js';
const UserRouter = express.Router()

UserRouter.get("/me", requireAccessToken, asyncHandler(UserController.fetchUserInfo));
UserRouter.patch("/me", requireAccessToken, asyncHandler(UserController.updateUserInfo));
UserRouter.post("/uploadAvatar", requireAccessToken, upload.single("avatar"), asyncHandler(UserController.uploadAvatar));
UserRouter.patch("/me/cover", requireAccessToken, upload.single("cover"), asyncHandler(UserController.uploadCover));
export default UserRouter