import '@core/declarations'
import { Request, Response } from 'express'
import requestValidator from '@helpers/request-validator.helper'
import { SignOutDTO } from '../dto/sign-out.dto'

export default async function SignOut(req: Request, res: Response) {
	const { user } = req
	const existingUser = await App.Models.User.findOne({
		_id: user._id,
		isActive: true,
	})

	if (!existingUser) {
		return res.forbidden({
			message: App.Messages.Auth.Error.UserNotExists(),
		})
	}
	// All Done
	return res.success({
		message: App.Messages.Auth.Success.SignOutSuccessful(),
	})
}
