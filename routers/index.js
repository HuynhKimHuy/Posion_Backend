import express from 'express'
import AccessRouter from './access/auth.route.js'
import UserRouter from './user/User.Route.js'
import { requireAccessToken } from '../middleware/authHeader.middleware.js'
const router = express.Router()

router.use('/api/auth',AccessRouter)
router.use(requireAccessToken)
router.use('/api/user',UserRouter)

export default router
