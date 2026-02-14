import express from 'express'
import AccessRouter from './access/auth.route.js'
import UserRouter from './user/User.Route.js'
import FriendRouter from './friend/Friend.Route.js'
import { requireAccessToken } from '../middleware/authHeader.middleware.js'
const router = express.Router()

router.use('/api/auth',AccessRouter)

router.use(requireAccessToken) //protect APi user
router.use('/api/user',UserRouter)
router.use('/api/friend',FriendRouter)

export default router
