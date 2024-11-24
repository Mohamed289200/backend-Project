const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Username is required"],
			maxLength: [50, "Username MUST NOT exceed 50 characters, got {VALUE}"],
		},
		gender: {
			type: String,
			required: [true, "Gender is required"],
			enum: ["male", "female", "else", null],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: [true, "This email already exists"],
			minLength: [
				10,
				"Email size MUST be more than 10 characters, got {VALUE}",
			],
			maxLength: [
				150,
				"Email size MUST NOT exceed 150 characters, got {VALUE}",
			],
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [8, "Password MUST be more than 8 characters, got {VALUE}"], // Regex
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			maxLength: [
				20,
				"Phone number MUST NOT exceed 20 characters, got {VALUE}",
			],
		},
		city: {
			type: String,
			required: [true, "City is required"],
			maxLength: [30, "City MUST NOT exceed 30 characters, got {VALUE}"],
		},
		country: {
			type: String,
			required: [true, "Country is required"],
			maxLength: [30, "Country MUST NOT exceed 30 characters, got {VALUE}"],
		},
		role: {
			type: String,
			required: [true, "Role is required"],
			enum: ["user", "patient", "doctor", "nurse", "hospital"],
		},
		specialization: {
			type: String,
			maxLength: [
				40,
				"Specialization MUST NOT exceed 40 characters, got {VALUE}",
			],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
