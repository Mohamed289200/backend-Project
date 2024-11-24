const mongoose = require("mongoose");

const diseaseSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, "This Diseases MUST have a name"],
		},
		description: {
			type: String,
			require: [true, "This Diseases MUST have a description"],
			maxLength: [400, "Description MUSTn't exceed 400 characters"],
		},
		rank: {
			type: String,
			require: [true, "This Diseases MUST have a rank"],
			enum: ["critical", "severe", "moderate", "mild"],
		},
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model("Diseases", diseaseSchema);
