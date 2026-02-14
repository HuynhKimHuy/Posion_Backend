import express from "express";
import asyncHandler from "../../middleware/asyncHandler.js";

import {
    sendFriendRequest,
    accepFriendRequest,
    declineFriendRequest,
    getAllFriends,
    getAllFriendRequest
} from "../../controllers/FriendController.js";

const FriendRouter = express.Router();

FriendRouter.get("/requests", asyncHandler(sendFriendRequest));
FriendRouter.get("/requests/:requestId/accept", asyncHandler(accepFriendRequest));
FriendRouter.get("/requests/:requestId/decline", asyncHandler(declineFriendRequest));
FriendRouter.get("/", asyncHandler(getAllFriends));
FriendRouter.get("/requests", asyncHandler(getAllFriendRequest));
export default FriendRouter;
