const { Schema } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
	{
		name: {
			type: String,
			unique: true,
			required: [true, "Name is required"],
			minlength: [3, "Name must be at least three characters"],
			maxlength: [20, "Name must be at most twenty characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			validate: [
				validator.isEmail,
				"Please provide a valid email",
			],
		},
		password: {
			type: String,
			required: true,
			minlength: [3, "Password must be at lease 3 characters"],
			maxlength: [
				255,
				"Passwod must be at most 255 characters",
			],
			select: false,
		},
		confirmPassword: {
			type: String,
			required: [true, "ConfirmPassword is required"],
			minlength: [
				3,
				"ConfirmPassword must be at least 3 characters",
			],
			maxlength: [
				255,
				"ConfirmPassword mest be at most 255 characters",
			],
			validate: {
				validator: function (value) {
					return this.password === value;
				},
				message:
					"Password and ConfirmPassword must be the same",
			},
		},
	},
	{
		timestamps: true,
		collection: "user",
	},
);

module.exports = userSchema;
