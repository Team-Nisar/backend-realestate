import '@core/declarations'
import { Router } from 'express'
import RateLimit from 'express-rate-limit'
import authRouter from '@modules/auth/routes'
import HashGeneratorFromArrayHelper from '@helpers/hash-generator-from-array.helper'
import { meRouter } from '@modules/me/routes'
import { authorize } from '@middlewares/authorizer'
import { codeVerificationRouter } from '@modules/code-verification/routes'

const rateLimiter = RateLimit({
	windowMs: 60 * 1000 * 1, // Time window of 1 minute
	max: 1000, // Max hits allowed
	standardHeaders: false,
	legacyHeaders: false,
	keyGenerator: (req) => HashGeneratorFromArrayHelper.Generate([req.ip, req.originalUrl]),
	handler: (req,res)=> res.tooManyRequest()
})

const router = Router()
router.use(rateLimiter)

router.use('/auth', authRouter)
router.use('/code-verification', codeVerificationRouter)
router.use(authorize)
router.use('/me', meRouter)

export const AppRoutes = router
