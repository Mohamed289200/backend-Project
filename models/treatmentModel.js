import mongoose from "mongoose";

const treatmentSchema = mongoose.Schema(
	{
		diseaseID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Diseases",
			required: [true, "A Treatment must be associated with a Disease ID"],
		},
		name: {
			type: String,
			required: [true, "This Treatment MUST have a name"],
		},
		description: {
			type: String,
			required: [true, "This Treatment MUST have a description"],
			maxLength: [500, "Description MUST NOT exceed 500 characters"],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Treatment", treatmentSchema);
