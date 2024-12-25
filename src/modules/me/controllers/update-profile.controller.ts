// import '@core/declarations'
// import requestValidator from '@helpers/request-validator.helper'
// import { Request, Response } from 'express'
// import { UpdateProfileDTO } from '../dto'

// export default async function updateProfile(req: Request, res: Response) {
// 	const { _id } = req.user
// 	const errors = await requestValidator(UpdateProfileDTO, req.body)
// 	if (errors) {
// 		return res.unprocessableEntity({ errors })
// 	}
// 	const { firstName, lastName } = req.body
// 	const admin = await App.Models.Admin.findById(_id).select('-password')
// 	if (!admin) {
// 		return res.notFound({
// 			error: App.Messages.Auth.Error.UserNotExists(),
// 		})
// 	}
	
// 	if (!firstName && !lastName) {
// 		return res.badRequest({
// 			error: App.Messages.Auth.Error.ProvideFieldToUpdate(),
// 		})
// 	}

// 	if (firstName) admin.firstName = firstName
// 	if (lastName) admin.lastName = lastName
// 	await admin.save()
// 	return res.success({
// 		message: App.Messages.Auth.Success.ProfileUpdatedSuccessfully(),
// 	})
// }
