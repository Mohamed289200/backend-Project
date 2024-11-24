import mongoose from "mongoose";

const adviceSchema = mongoose.Schema(
	{
		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
			required: [true, "Doctor ID is required"],
		},
		diseasesCategoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "DiseasesCategory",
			required: [true, "Diseases Category ID is required"],
		},
		description: {
			type: String,
			required: [true, "This Advice MUST have a description"],
			maxLength: [400, "Description MUST NOT exceed 400 characters"],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Advice", adviceSchema);
