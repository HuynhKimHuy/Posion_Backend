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

FriendRouter.post("/requests", asyncHandler(sendFriendRequest));
FriendRouter.post("/requests/:requestId/accept", asyncHandler(accepFriendRequest));
FriendRouter.post("/requests/:requestId/decline", asyncHandler(declineFriendRequest));
FriendRouter.get("/", asyncHandler(getAllFriends));
FriendRouter.get("/requests", asyncHandler(getAllFriendRequest));
export default FriendRouter;
