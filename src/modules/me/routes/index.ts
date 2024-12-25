import { Wrap } from '@core/utils'
import { Router } from 'express'
// import ProfileController from '@modules/me/controllers'


// const controller = new ProfileController()
const router = Router()




// router.get('/get-details', Wrap(controller.GetAdminDetails))
// router.patch('/change-password', Wrap(controller.ChangePassword))
// router.patch('/update-profile', Wrap(controller.UpdateProfile))
// router.post('/update-profile-image',Wrap(controller.UpdateProfileImage))
export const meRouter = router
