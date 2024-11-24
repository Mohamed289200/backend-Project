const mongoose = require("mongoose");

const diseasesCategorySchema = mongoose.Schema(
	{
		diseasesID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Diseases",
		},
		name: {
			type: String,
			require: [true, "This Diseases Category MUST have a name"],
		},
		description: {
			type: String,
			require: [true, "This Diseases Category MUST have a description"],
			maxLength: [400, "Description MUST NOT exceed 400 characters"],
		},
		rank: {
			type: String,
			require: [true, "This Diseases Category MUST have a rank"],
			enum: ["critical", "severe", "moderate", "mild"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("DiseasesCategory", diseasesCategorySchema);
