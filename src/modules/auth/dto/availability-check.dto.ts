import joi from 'joi'


export const AvailabilityCheckDTO = joi.object({
	phone: joi.string().min(3).max(15).optional(),
	countryCode: joi.string().min(1).max(3).optional(),
})
