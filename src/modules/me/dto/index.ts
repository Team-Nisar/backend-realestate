import constant from '@core/constants'
import joi from 'joi'

export const ChangePasswordDTO = joi.object({
	oldPassword: joi.string().required().min(8).max(30),
	newPassword: joi.string().required().min(8).max(30),
	confirmNewPassword: joi.string().required().min(8).max(30),
})

export const UpdateProfileDTO = joi.object({
	firstName: joi.string().optional(),
	lastName: joi.string().optional(),
})

export const UpdateProfileImageDTO = joi.object({
	remove: joi.boolean().optional(),
	type: joi.string()
		.valid(...constant.FILE_TYPES)
		.required(),
})