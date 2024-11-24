const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
	{
		patient_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
		},
		nurse_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
		},
		doctor_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: User,
		},
		priority: {
			type: String,
			require: [true, "You Must define priority for this appointment"],
			enum: ["critical", "important", "moderate", "low"],
		},
		appiontment_date: {
			type: Date,
			require: [true, "This appointment MUST have a date"],
		},
		status: {
			type: String,
			enum: ["finished", "ongoing", "queued"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Appointment", appointmentSchema);
