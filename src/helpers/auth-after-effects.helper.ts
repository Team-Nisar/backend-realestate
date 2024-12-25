import '@core/declarations'
import JWTHelper from '@helpers/jwt.helper'

export class AuthAfterEffectsHelper {
	async GenerateToken(payload: { [key: string]: any }) {
		const { _admin, email } = payload

		const existingUser = await App.Models.User.findOne(
			_.omitBy({ _id: _admin, email }, _.isNil)
		)

		// Generate a new JWT token
		const token = JWTHelper.GenerateToken({
			_id: existingUser._id.toString(),
		})

		existingUser.lastSigninAt = Date.now()

		await existingUser.save()

		return {
			token,
		}
	}
}

// All Done
export default new AuthAfterEffectsHelper()
