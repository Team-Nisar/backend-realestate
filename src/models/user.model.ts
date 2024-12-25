import '@core/declarations'
import { Models } from '@core/constants/database-models'
import { Document, model as Model, Schema } from 'mongoose'

export enum AccountType {
	INDIVIDUAL = 'INDIVIDUAL',
	AGENT = 'AGENT',
}
interface I_USER extends Document {
	fullName?: string
	email?: string
	phone?: string
	countryCode?: string
	accountType?: AccountType
	isActive: boolean
	city?: string
	lastSigninAt?: Date
}

const schema = new Schema<I_USER>(
	{
		fullName: String,
		email: String,
		phone: String,
		countryCode: String,
		city: String,
		accountType: { type: String, enum: Object.values(AccountType) },
		isActive: { type: Boolean, default: true },
		lastSigninAt: Date,
	},
	{
		autoIndex: true,
		versionKey: false,
		timestamps: true,
	}
)

// Function to check if any document exits with the given id
schema.static('findById', (value, projection = {}) => {
	return App.Models.User.findOne({ _id: value }, projection)
})

// Function to check if any document exits with the given email
schema.static('findByEmail', (email) => {
	return App.Models.User.findOne({ email, isActive: true })
})

// Function to check if any document exits with the given phone
schema.static('findByPhone', (phone, countryCode) => {
	return App.Models.User.findOne({
		countryCode,
		phone,
		isActive: true,
	})
})

export const UserModel = Model<I_USER>(Models.User, schema)
