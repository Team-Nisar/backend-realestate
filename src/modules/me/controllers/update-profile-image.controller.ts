// import '@core/declarations'
// import { S3Helper } from '@helpers/aws-s3.helper'
// import requestValidator from '@helpers/request-validator.helper'
// import { Request, Response } from 'express'
// import { UpdateProfileImageDTO } from '../dto'
// import constant from '@core/constants'
// import { encrypt } from '@helpers/crypto.helper'
// import moment from 'moment'
// import path from 'path'

// const MAX_FILE_SIZE_MB = constant.IMAGE.SIZE_IN_MB * 1024 * 1024

// export default async function updateProfileImage(req: Request & { files: any }, res: Response) {
// 	const errors = await requestValidator(UpdateProfileImageDTO, req.body)
// 	if (errors) {
// 		return res.unprocessableEntity({ errors })
// 	}

// 	const files = req.files
// 	const _user = req.user._id
// 	const { remove = false, type } = req.body

// 	const existingUser = await App.Models.Admin.findById(_user)
// 	if (remove && existingUser?.image?.key) {
// 		const {isSuccess } = await S3Helper.DeleteFile(existingUser.image.key)
// 		if (isSuccess) {
// 			existingUser.image = {}
// 			await existingUser.save()
// 			return res.success({message: App.Messages.Profile.Success.RemovedSuccessfully()})
// 		} else {
// 			return res.badRequest({message: App.Messages.Profile.Error.NotDeleted()})
// 		}
// 	}

// 	if (files.doc) {
// 		const fileData = files.doc // Extract file data
// 		// Check if the uploaded type is 'profile-image'
// 		if (type === constant.FILE_TYPES[1]) {
// 			// Validate the file
// 			const isValidMimeType = constant.IMAGE.MIME_TYPES.includes(fileData.mimetype)
// 			const isValidSize = fileData.size <= MAX_FILE_SIZE_MB

// 			if (!isValidMimeType) {
// 				return res.badRequest({
// 					message: `Profile Image: Unsupported file type (${fileData.mimetype}).`,
// 				})
// 			}

// 			if (!isValidSize) {
// 				return res.badRequest({
// 					message: `Profile Image: File size exceeds the limit of ${constant.IMAGE.SIZE_IN_MB} MB.`,
// 				})
// 			}
// 			// file upload variables
// 			const encodedUserId = encrypt(_user.toString())
// 			const folder = `${constant.AWS.S3.BUCKET_FOLDERS.USER}/${encodedUserId}/${constant.AWS.S3.BUCKET_FOLDERS.PROFILE_IMAGE}`
// 			const unixTimestamp = moment().valueOf().toString()
// 			let fileName = path.parse(fileData.name).name
// 			fileName = `${fileName}-${unixTimestamp}`
// 			const fileExtension = path.extname(fileData.name)

// 			// Upload to the s3
// 			const uploadedFile = await S3Helper.fileUpload({
// 				fileData: fileData.data,
// 				folderName: folder,
// 				fileName,
// 				fileExtension,
// 			})
// 			if (!uploadedFile.isSuccess) {
// 				return res.badRequest({
// 					message: App.Messages.Profile.Error.ProfileImageNotUploaded(),
// 				})
// 			}
// 			const uploadedData = {
// 				name: fileName,
// 				key: uploadedFile.data.key,
// 				url: uploadedFile.data.url,
// 			}
// 			existingUser.image = uploadedData
// 			await existingUser.save()
// 			return res.success({
// 				message: App.Messages.Profile.Success.FileUploaded(),
// 				item: uploadedData,
// 			})
// 		}
// 	}
// }
