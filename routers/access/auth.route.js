import express from 'express'
import AccessController from '../../controllers/AccessControler.js'
import asyncHandler from '../../middleware/asyncHandler.js'

const AccessRouter = express.Router()
AccessRouter.post('/signup', asyncHandler(AccessController.signup))
AccessRouter.post('/signin', asyncHandler(AccessController.signin))
AccessRouter.post('/logout', asyncHandler(AccessController.logout))
export default AccessRouter
