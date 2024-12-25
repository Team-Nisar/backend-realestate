import '@core/declarations'
import { Request, Response } from 'express'
import requestValidator from '@helpers/request-validator.helper'
import bcrypt from 'bcrypt'
import authAfterEffectsHelper from '@helpers/auth-after-effects.helper'
import { SignInDTO } from '../dto/sign-in.dto'
import { CodeVerificationStatus, CodeVerificationPurpose } from '@models/code-verification'
import Dayjs from 'dayjs'

export default async function SignIn(req: Request, res: Response) {
	const errors = await requestValidator(SignInDTO, req.body)
	if (errors) {
		return res.unprocessableEntity({ errors })
	}

	const {
		countryCode,
		phone,
		_codeVerification,
		rememberMe = false,
	} = req.body

	const existingUser = await App.Models.User.findByPhone(phone.trim(), countryCode.trim()).select(
		'+password'
	)

	if (!existingUser) {
		return res.notFound({
			message: App.Messages.Auth.Error.AccountNotFound({
				type:'phone',
			}),
		})
	}

	if (
		phone &&
		countryCode
	) {
		const codeVerification = await App.Models.CodeVerification.findOne({
			_id: _codeVerification,
			status: CodeVerificationStatus.Passed,
			purpose: CodeVerificationPurpose.SIGNIN_2FA,
			isActive: true,
		}).sort({ createdAt: -1 })

		if (!codeVerification) {
			return res.badRequest({
				message: App.Messages.Auth.Error.PreSignCodeVerificationFailed(),
			})
		}

		// Get expiration config and check for code expiry
		const { EXPIRATION_TIME_FOR_PASSED_CODE, EXPIRATION_TIME_FOR_PASSED_CODE_UNIT } =
			App.Config.CODE_VERIFICATION
		if (
			Dayjs(codeVerification.verificationPerformedAt).isBefore(
				Dayjs().subtract(
					EXPIRATION_TIME_FOR_PASSED_CODE,
					EXPIRATION_TIME_FOR_PASSED_CODE_UNIT
				)
			)
		) {
			codeVerification.isActive = false
			await codeVerification.save()
			return res.forbidden({ message: App.Messages.GeneralError.SessionExpired() })
		}
	}

	const tokenPromise = authAfterEffectsHelper.GenerateToken({
		_user: existingUser._id.toString(),
	})

	const { token } = await tokenPromise

	return res.success({
		message: App.Messages.Auth.Success.SigninSuccessful(),
		items: { token },
	})
}
