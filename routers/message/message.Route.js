import express from 'express'
import asyncHandler from '../../middleware/asyncHandler.js'
import { sendDirectMessage, sendGroupMessage } from '../../controllers/MessageController.js'
import { checkFriendship } from '../../middleware/friendMiddleWare.js'
import { getConversation } from '../../middleware/conversation.middleware.js'
const MessageRouter = express.Router()

MessageRouter.post('/direct', checkFriendship, asyncHandler(sendDirectMessage))
MessageRouter.post('/group', getConversation, asyncHandler(sendGroupMessage))

export default MessageRouter