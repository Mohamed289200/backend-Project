const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, "Username is required"],
			maxLength: [50, "Username mustn't exceed 50 characters,got {VALUE}"],
		},
		gender: {
			type: Boolean,
			require: [true, "Gender is required"],
			enum: ["male", "female", "else", null],
		},
		email: {
			type: String,
			require: [true, "Email is required"],
			unique: [true, "This email is already exist"],
			minLength: [10, "Email size must be more than 10 characters,got {VALUE}"],
			maxLength: [150, "Email size mustn't exceed 1500 characters,got {VALUE}"],
			trim: true,
		},
		password: {
			type: String,
			require: [true, "Password is required"],
			minLength: [8, "Password must be more than 8 characters,got {VALUE}"], // Regex
		},
		phone: {
			type: String,
			require: [true, "Phone number is required"],
			maxLength: [20, "Phone number mustn't exceed 20 numbers,got {VALUE}"],
		},
		city: {
			type: String,
			require: [true, "City is required"],
			maxLength: [30, "City mustn't exceed 20 numbers,got {VALUE}"],
		},
		country: {
			type: String,
			require: [true, "Country is required"],
			maxLength: [30, "Country mustn't exceed 20 numbers,got {VALUE}"],
		},
		role: {
			type: String,
			require: [true, "Role is required"],
			enum: ["user", "patient", "doctor", "nurse", "hospital"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
