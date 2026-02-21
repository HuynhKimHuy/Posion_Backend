import express from 'express'
import asyncHandler from '../../middleware/asyncHandler.js'
import { checkFriendship } from '../../middleware/friendMiddleWare.js'
import {createConversation ,getConversations ,getConversationMessages} from '../../controllers/ConversationController.js'

const ConversationRouter = express.Router()
ConversationRouter.post("/",checkFriendship,asyncHandler(createConversation))
ConversationRouter.get("/",asyncHandler,checkFriendship,(getConversations))
ConversationRouter.get("/:conversationId/message",checkFriendship,asyncHandler(getConversationMessages))

export default ConversationRouter