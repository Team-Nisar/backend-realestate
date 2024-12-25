import { Router } from 'express'
import { Wrap } from '@core/utils'
import AuthController from '@modules/auth/controllers'
import { authorize } from '@middlewares/authorizer'

const router = Router()
const controller = new AuthController()

router.post('/login', Wrap(controller.Login))
// router.post('/forgot-password', Wrap(controller.ForgotPassword))
// router.patch('/reset-password', Wrap(controller.ResetPassword))

// Secure Routes
router.use(authorize)
router.patch('/logout', Wrap(controller.Logout))

export default router
