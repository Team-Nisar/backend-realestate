import { NextFunction } from 'express'
import JWTHelper from '@helpers/jwt.helper'

const authenticateSocket = async (socket: any, next: NextFunction) => {
	try {
		const token = socket.handshake.headers?.authorization

		if (!token) {
			return next(new Error(App.Messages.GeneralError.Unauthorized()))
		}
		const response = await JWTHelper.GetUser({ token })

		if (!response) {
			return next(new Error(App.Messages.GeneralError.Unauthorized()))
		}

		if (response.error) {
			return next(new Error(response.error.message))
		}
		const { user } = response
		socket._user = user._id.toString()
		socket.id = user._id.toString()
		socket.username = user.username
		socket.availableBalance = Number(user.availableBalance.toFixed(4))
		socket.isCurrentlyInRoom = user.isCurrentlyInRoom
		socket.walletAddress = user.walletAddress
		next()
	} catch (error) {
		Logger.error(error)
		return next(new Error(error))
	}
}
export default authenticateSocket
