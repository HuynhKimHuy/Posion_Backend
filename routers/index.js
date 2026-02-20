import express from 'express'
import AccessRouter from './access/auth.route.js'
import UserRouter from './user/User.Route.js'
import FriendRouter from './friend/Friend.Route.js'
import { requireAccessToken } from '../middleware/authHeader.middleware.js'
import MessageRouter from './message/message.Route.js'
import ConversationRouter from './conversation/conversation.route.js'
const router = express.Router()

router.use('/api/auth', AccessRouter)
router.use(requireAccessToken) //protect APi user
router.use('/api/user', UserRouter)
router.use('/api/friend', FriendRouter)
router.use('/api/message', MessageRouter)
router.use('/api/conversation',ConversationRouter)
export default router
