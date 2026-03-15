import express from 'express'
import asyncHandler from '../../middleware/asyncHandler.js'
import { checkFriendship } from '../../middleware/friendMiddleWare.js'
import { createConversation, getConversations, getConversationMessages, markConversationAsRead } from '../../controllers/ConversationController.js'

const ConversationRouter = express.Router()
ConversationRouter.post("/", checkFriendship, asyncHandler(createConversation))
ConversationRouter.get("/", asyncHandler(getConversations))
ConversationRouter.get("/:conversationId/messages", asyncHandler(getConversationMessages))
ConversationRouter.post("/:conversationId/read", asyncHandler(markConversationAsRead))


export default ConversationRouter