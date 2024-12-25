import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import { AvailabilityCheckDTO } from '../dto/availability-check.dto'
import { phone as Phone } from 'phone'

export default async function GetUserDetails(req: Request, res: Response) {
	const errors = await requestValidator(AvailabilityCheckDTO, req.query)
	if (errors) {
		return res.unprocessableEntity({ errors })
	}
	const { phone, countryCode } = req.query

	const searchField = {
		name: null,
		value: null,
	}
	let existingUser = null
	 if (phone && countryCode) {
		// Validate the phone number
		const isPhoneValid = Phone(`+${countryCode}${phone}`)
		if (!isPhoneValid.isValid) {
			return res.forbidden({
				message: App.Messages.CodeVerification.Error.InvalidPhoneNumber(),
			})
		}
		searchField.name = 'phone'
		searchField.value = phone
		existingUser = await App.Models.User.findByPhone(phone, countryCode)
	} else {
		return res.unprocessableEntity()
	}

	if (!existingUser) {
		return res.badRequest({
			message: App.Messages.Auth.Error.AccountNotFound({
				type: 'phone',
			}),
		})
	}

	// All Done
	return res.success({
		message: App.Messages.Auth.Success.UserDetails(),
		item: _.omitBy(
			{
				[searchField.name]: searchField.value,
				countryCode: existingUser.countryCode,
				fullName: existingUser.fullName ?? 'User',
				_user: existingUser._id,
			},
			_.isNil
		),
	})
}
