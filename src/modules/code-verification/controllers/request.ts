import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import {
	RequestDTO,
	// RequestByPhoneDTO,
	RequestByEmailOrPhoneDTO,
	// RequestByEmailForgotPasswordDTO,
	RequestForSignin2FADTO,
} from '../dtos/request.dto'
import { CodeVerificationPurpose, CodeVerificationStatus } from '@models/code-verification'
import Dayjs from 'dayjs'
// import { MailHelper } from '@helpers/email.helper'
import { GenerateRandomNumberOfLength } from '@core/utils'
import otpHelper from '@helpers/otp.helper'
// import { GenerateRandomNumberOfLength } from '@core/utils'

const {
	RESEND_LIMIT_IN_SESSION,
	RESEND_SESSION_DURATION,
	RESEND_SESSION_DURATION_UNIT,
}: {
	RESEND_DURATION: number[]
	RESEND_LIMIT_IN_SESSION: number
	RESEND_SESSION_DURATION: number
	RESEND_SESSION_DURATION_UNIT: any
} = App.Config.CODE_VERIFICATION

// const { INVALID_SIGNIN_ATTEMPTS_LIMIT } = App.Config.SIGNIN

export default async function CodeVerificationRequest(req: Request, res: Response) {
	const errors = await requestValidator(RequestDTO, req.body)
	if (errors) {
		return res.unprocessableEntity({ errors })
	}

	const {  phone, countryCode, purpose, _user } = req.body

	// const { user } = req

	const payload = _.omitBy(
		{
			phone,
			countryCode,
			purpose,
		},
		_.isNil
	)

	let existingUser = null

	// validations by purpose type PRE_SIGNUP
	if (purpose === CodeVerificationPurpose.PRE_SIGNUP) {
		const errors = await requestValidator(RequestByEmailOrPhoneDTO, req.body)
		if (errors) {
			return res.unprocessableEntity({ errors })
		}
	}

	// validations by purpose type FORGOT_PASSWORD
	// if (purpose === CodeVerificationPurpose.FORGOT_PASSWORD) {
	// 	const errors = await requestValidator(RequestByEmailForgotPasswordDTO, req.body)
	// 	if (errors) {
	// 		return res.unprocessableEntity({ errors })
	// 	}

	// 	// Fetch the user with email id
	// 	if (payload.email) {
	// 		existingUser = await App.Models.User.findByEmail(payload.email).select('+socialId')
	// 	}
	// 	// Fetch the user with mobile
	// 	else if (payload.phone) {
	// 		existingUser = await App.Models.User.findByPhone(
	// 			payload.phone,
	// 			payload.countryCode
	// 		).select('+socialId')
	// 	} else {
	// 		return res.badRequest({
	// 			message: App.Messages.GeneralError.BadRequest(),
	// 		})
	// 	}

	// 	// Abort if user not exists
	// 	if (!existingUser) {
	// 		return res.notFound({
	// 			message: App.Messages.CodeVerification.Error.UserNotExists(),
	// 		})
	// 	}

	// 	// Abort if user has social account/id
	// 	if (existingUser.socialId) {
	// 		return res.unauthorized({
	// 			message:
	// 				App.Messages.CodeVerification.Error.ForgotPasswordSocialAccountNotAllowed(),
	// 		})
	// 	}

	// 	if (payload.phone) {
	// 		payload.countryCode = existingUser.countryCode
	// 		payload.phone = existingUser.phone
	// 	}
	// }

	// validations by purpose type USER_PHONE_UPDATE
	// if (purpose === CodeVerificationPurpose.USER_PHONE_UPDATE) {
	// 	const errors = await requestValidator(RequestByPhoneDTO, {
	// 		phone,
	// 		countryCode,
	// 	})
	// 	if (errors) {
	// 		return res.unprocessableEntity({ errors })
	// 	}

	// 	const existingUserCount = await App.Models.User.countDocuments({
	// 		_id: { $ne: user._id },
	// 		phone,
	// 		isActive: true,
	// 		countryCode,
	// 	})
	// 	if (existingUserCount) {
	// 		return res.conflict({
	// 			message: App.Messages.CodeVerification.Error.PhoneAlreadyInUse(),
	// 		})
	// 	}
	// 	payload._user = user._id
	// }

	// validations by purpose type SIGNIN_2FA
	if (purpose === CodeVerificationPurpose.SIGNIN_2FA) {
		const errors = await requestValidator(RequestForSignin2FADTO, {
			_user,
		})
		if (errors) {
			return res.unprocessableEntity({ errors })
		}

		existingUser = await App.Models.User.findOne({ _id: _user, isActive: true })

		// Abort if user not exists
		if (!existingUser) {
			return res.forbidden({
				message: App.Messages.Error.CodeVerification.UserNotExists(),
			})
		}
		payload._user = existingUser._id
	}
	// if (purpose === CodeVerificationPurpose.UPDATE_2FA_SETTING_TO_PHONE) {
	// 	const errors = await requestValidator(RequestByPhoneDTO, {
	// 		phone,
	// 		countryCode,
	// 	})
	// 	if (errors) {
	// 		return res.unprocessableEntity({ errors })
	// 	}
	// 	existingUser = await App.Models.User.findOne({
	// 		_id: user._id,
	// 		phone,
	// 		countryCode,
	// 		isActive: true,
	// 	})
	// 	if (!existingUser) {
	// 		return res.notFound({
	// 			message: App.Messages.CodeVerification.Error.UserNotExists(),
	// 		})
	// 	}
	// 	payload._user = user._id
	// 	payload.purpose = purpose // Ensure 'purpose' is explicitly added
	// 	payload.status = CodeVerificationStatus.Pending // Default status
	// }

	/* OTP Resend Validation START */
	// Find previous OTP resend counts
	const _payload = JSON.parse(JSON.stringify(payload))
	delete _payload.constructedKey

	const filterFunction = () => {
		if (existingUser && purpose === CodeVerificationPurpose.SIGNIN_2FA) {
			return {
				createdAt: {
					$gt: existingUser.lastSigninAt,
				},
			}
		}
		return
	}
	const previousCodeVerificationAttempts = await App.Models.CodeVerification.find({
		..._payload,
		status: {
			$in: Object.values(CodeVerificationStatus),
		},
		$and: [
			{
				createdAt: {
					$gt: Dayjs()
						.subtract(RESEND_SESSION_DURATION, RESEND_SESSION_DURATION_UNIT)
						.toDate(),
				},
			},
			filterFunction(),
		].filter((e) => e != undefined),
	})
		.select('+verificationLinkToken +internalOTP')
		.sort({ _id: -1 })

	// last code sent record
	const lastCodeVerification = previousCodeVerificationAttempts.length
		? previousCodeVerificationAttempts[0]
		: null

	if (previousCodeVerificationAttempts.length >= RESEND_LIMIT_IN_SESSION) {
		return res.tooManyRequests({
			message: App.Messages.CodeVerification.Error.ResendLimitExceeded(),
		})
	}

	if (lastCodeVerification) {
		const resendShouldGetAllowedAfter = Dayjs(lastCodeVerification.createdAt).add(
			lastCodeVerification.resendDuration,
			'second'
		)
		if (Dayjs().isBefore(resendShouldGetAllowedAfter)) {
			const resendShouldGetAllowedInSeconds = resendShouldGetAllowedAfter.diff(
				Dayjs(),
				'seconds'
			)
			return res.badRequest({
				message: App.Messages.CodeVerification.Error.ResendIsNotAvailable({
					resendShouldGetAllowedInSeconds,
				}),
			})
		}
	}
	const OTP = GenerateRandomNumberOfLength(4)
	const codeVerification = await App.Models.CodeVerification.create({
		...payload,
		internalOTP: {
			code: OTP.toString(),
		},
	})

	// All Done
	const codeVerificationJSON = codeVerification.toObject()
	delete codeVerificationJSON.internalOTP
	delete codeVerificationJSON.verificationLinkToken
	// if (codeVerification.email) {
	// 	await MailHelper.send({
	// 		to: email,
	// 		subject: 'Welcome to Joblo! Confirm Your Account',
	// 		templateName: 'verify-email',
	// 		data: { code: OTP },
	// 	})
	// }
	// if (codeVerification.phone && codeVerification.countryCode) {
	// 	await otpHelper.SendCodeToMobile(
	// 		countryCode + phone,
	// 		App.Messages.Helpers.OTPHelper.CodeSentSuccessFullyOverEmail({
	// 			OTP,
	// 			BrandName: App.Config.AWS.BRAND_NAME,
	// 		})
	// 	)
	// }
	return res.success({
		message: App.Messages.CodeVerification.Success.CodeSent({
			type:'code',
			to: 'phone number',
		}),
		item: {
			...codeVerificationJSON,
		},
	})
}
