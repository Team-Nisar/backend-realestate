// import '@core/declarations'
// import { Request, Response } from 'express'

// export default async function getAdminDetails(req: Request, res: Response) {
// 	const { _id } = req.user

// 	// Find the user by ID, excluding the password field
// 	const admin = await App.Models.Admin.findById(_id).select('-password')

// 	if (!admin) {
// 		return res.notFound({
// 			error: App.Messages.Auth.Error.UserNotExists(),
// 		})
// 	}
// 	// Prepare the admin details to be returned
// 	const adminDetails = {
// 		firstName: admin.firstName,
// 		lastName: admin.lastName,
// 		email: admin.email,
// 		accountType: admin.accountType,
// 		createdAt: admin.createdAt,
// 		updatedAt: admin.updatedAt,
// 		image: admin.image
// 	}

// 	// Return the admin details
// 	return res.success({
// 		message: App.Messages.Auth.Success.AdminDetailsFetchedSuccessfully(),
// 		item: adminDetails,
// 	})
// }
