const mongoose = require("mongoose");
const adviceSchema = mongoose.Schema(
	{
		doctorID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
		},
		diseasesCategoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "DiseasesCategory",
		},
		description: {
			type: String,
			require: [true, "This Advice MUST have a description"],
			maxLength: [400, "Description MUST NOT exceed 400 characters"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Advice", adviceSchema);
