import MongoId from '@helpers/object-id-validator.helper'
import Joi from 'joi'

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const SignInDTO = Joi.object({
	countryCode: Joi.string().min(2),
	phone: Joi.string().min(5).max(16),
	_codeVerification: Joi.string().custom(MongoId.Validate, 'ObjectId Validation'),
	rememberMe: Joi.boolean().optional(),
})
	.xor('phone')
	.when(Joi.object({ phone: Joi.exist() }).unknown(), {
		then: Joi.object({
			countryCode: Joi.required(),
			phone: Joi.required(),
		}),
	})
