const mongoose = require("mongoose");

const diseaseSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "This Disease MUST have a name"],
		},
		description: {
			type: String,
			required: [true, "This Disease MUST have a description"],
			maxLength: [400, "Description MUST NOT exceed 400 characters"],
		},
		rank: {
			type: String,
			required: [true, "This Disease MUST have a rank"],
			enum: ["critical", "severe", "moderate", "mild"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Diseases", diseaseSchema);
