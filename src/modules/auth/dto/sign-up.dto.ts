import MongoId from '@helpers/object-id-validator.helper'
import Joi from 'joi'
import { emailRegex } from './sign-in.dto'

export const SignupDTO = Joi.object({
	_codeVerification: Joi.string().custom(MongoId.Validate, 'ObjectId Validation').required(),
	email: Joi.string().pattern(emailRegex).required().messages({
		'string.pattern.base': 'Please enter a valid email address',
	}),
	countryCode: Joi.string().min(2).required(),
	phone: Joi.string().min(5).max(16).required(),
	fullName: Joi.string().required(),
	city: Joi.string().required(),
})
	.xor('phone')
	.when(Joi.object({ phone: Joi.exist() }), {
		then: Joi.object({
			countryCode: Joi.required(),
			phone: Joi.required(),
		}),
	})
