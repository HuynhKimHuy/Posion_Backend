import express from 'express'
import asyncHandler from '../../middleware/asyncHandler.js';
import { requireAccessToken } from '../../middleware/authHeader.middleware.js';
import AccessController from '../../controllers/AccessControler.js';
const UserRouter = express.Router()

UserRouter.get("/me", requireAccessToken, asyncHandler(AccessController.fetchUserInfo));

export default UserRouter