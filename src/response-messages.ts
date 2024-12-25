import Config, { ConfigInterface } from '@config'
const config: ConfigInterface = Config()

export const Messages = {
	GeneralError: {
		InsufficientBalance: 'Insufficient Balance',
		Unauthorized: 'Unauthorized',
		SomethingWentWrong: 'Something went wrong.',
		BadRequest: 'Bad Request',
		// AccountBlockedByAdmin: `Your account has been deactivated by the administrator, for more updates kindly contact ${config.SUPPORT_EMAIL}.`,
	},
	Helpers: {
		OTPHelper: {
			CodeSentSuccessFullyOverEmail:
				'This is your One Time Password: {{OTP}} from {{BrandName}}',
		},
		VerifyLinkHelper: {
			ForgotPasswordSMS: 'Link {{verifyLink}} from {{BrandName}}',
		},
		JWTHelper: {
			TokenExpired: 'Token Expired! Please signin again.',
		},
	},
	CodeVerification: {
		Success: {
			GetSuccess: 'Verification status fetched successfully.',
			CodeSent: 'Verification {{type}} has been sent to your {{to}}.',
			CodeVerified: 'Verification code verified successfully.',
			CodeResent: 'Verification {{type}} has been re-sent to your {{to}}.',
		},
		Error: {
			InvalidLink: 'Invalid Link!',
			UserNotExists: 'Sorry, we could not find your account.',
			ForgotPasswordSocialAccountNotAllowed:
				'Your account is created with Social Signup, please try with Social Login!',
			UserEmailUpdateInSocialAccountNotAllowed:
				"Your account is created with Social Signup, can't update email!",
			TwoFactorAuthenticationSettingsNotAvailable: 'Your account did not have 2FA Settings.',
			TwoFactorAuthenticationAlreadySet: '2FA Already Set.',
			RequiredDetailFor2FANotAvailable: 'Please set your {{detail}} first.',
			ResendLimitExceeded: 'You have exceeded the limits, please try again in some time.',
			ResendIsNotAvailable:
				'You are allowed to resend after {{resendShouldGetAllowedInSeconds}} seconds.',
			SessionExpired: 'This session has expired!',
			CodeVerificationExpired: 'Verification {{type}} has expired.',
			CodeVerificationFailed: 'Verification code is invalid.',
			IncorrectCode: 'The verification code password is incorrect. Please try again',
			MissingRecordToVerify: 'No record found for verification.',
			AccountBlockedDueToMultipleAttempts:
				'Your account has been blocked for {{timeLeftToUnblock}}. Please try again later.',
			DisabledAccount: 'Your account has been disabled.',
			EmailAlreadyInUse: 'Email is already in use.',
			PhoneAlreadyInUse: 'Phone is already in use.',
			InvalidPhoneNumber: 'Invalid phone number.',
			CodeVerificationNotFound: 'Code verification not found.',
		},
	},
	Auth: {
		Success: {
			AvailabilityCheck: 'Availability checked successfully.',
			SigninSuccessful: 'Signin successfully.',
			SignoutSuccessful: 'Logged out successfully.',
			PasswordChangedSuccessfully:
				'Password has been changed successfully, Please log in again.',
			ProfileUpdatedSuccessfully: 'Profile has been updated successfully.',
			AdminDetailsFetchedSuccessfully: 'Admin details fetched successfully.',
			PasswordResetSuccessfully: 'Password reset successfully.',
			ResetPasswordLinkSent: 'Reset password link has been sent.',
		},
		Error: {
			InvalidCredentials: 'Invalid Credentials',
			UserNotExists: 'Sorry, we could not find your account.',
			AlreadyLoggedOut: 'Cannot proceed, Please log in first.',
			ProvideFieldToUpdate: 'Please provide at least one field to update.',
			SamePasswordNotAllowed:
				'Your current password and new password is same, provide different new password.',
			PasswordNotMatch: 'Your new password and confirm new password did not match.',
			SomethingWentWrong: 'Something went wrong while generating reset token',
			InvalidResetToken: 'Invalid reset token or token has been expired.',
		},
	},
	Users: {
		Success: {
			AllUsersFetchedSuccessfully: 'All users fetched successfully.',
			UserFetchedSuccessfully: 'User details fetched successfully.',
			ResumeFetchedSuccessfully: 'User resume fetched successfully.',
			LatestUser: 'Latest job seekers fetched successfully.',
		},
		Error: {
			UserNotFound: 'Sorry, we could not find the account in our platform.',
		},
	},
	Mail: {
		Subject: {
			ResetPassword: 'Reset Password Link',
		},
	},
	Profile: {
		Success: {
			DetailsUpdated: 'Your profile details updated successfully.',
			AccountDetailsUpdated: 'Account details updated successfully.',
			FileUploaded: 'Profile image uploaded successfully.',
			RemovedSuccessfully: 'Profile image removed successfully.',
		},
		Error: {
			FileSizeExceeded: 'File size cannot be more than 2MB.',
			FileTypeNotAllowed: 'The uploaded {{type}} file type is not supported.',
			FileNotFound: 'Please provide a file to uplaod.',
			ProfileImageNotUploaded: 'Something went wrong while uploading the profile image.',
			NotDeleted: 'Something went wrong while deleting the profile image.',
		},
	},
}
