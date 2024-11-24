const mongoose = require("mongoose");

const treatmentSchema = mongoose.Schema(
	{
		diseaseID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Diseases",
		},
		name: {
			type: String,
			require: [true, "This Treatment MUST have a name"],
		},
		description: {
			type: String,
			require: [true, "This Treatment MUST have a description"],
			maxLength: [500, "Description MUST NOT exceed 400 characters"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Treatment", treatmentSchema);
