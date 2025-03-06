import user from "../models/userModel.js";
import Appointment from "../models/appointmentModel.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"


dotenv.config()

export const store = async (req, res) => {
	try {
		const patientId = req.user._id;
		const patient = await user.findById(patientId);
		// const doctorId = req.body.doctorId;
		const doctorId = req.params.id;
		const doctor = await user.findById(doctorId);
		const role = req.user.role;

		if (role !== "admin" && role !== "hospital") {
			const { nurseId, priority, appointmentDate } = req.body;
			const appoint = new Appointment({
				patientId,
				nurseId,
				doctorId,
				priority,
				appointmentDate,
				patientName: patient.name,
				doctorName: doctor.name,
			});
			const savedAppointment = await appoint.save();
			const userId = appoint.patientId;
			if (!doctor) {
				console.error(`doctor not found with id ${doctorId}`);
				return res
					.status(404)
					.json({ success: false, message: "Tour not found" });
			}
			await doctor.updateOne({
				$push: { appoints: savedAppointment }
				//$push: { appointments: savedAppointment._id },
			});
			await user.findByIdAndUpdate(
				{ _id: userId },
				{ $push: { appoints: savedAppointment } }
			);

			res.status(200).json({
				message: "Appointment booked successfully",
				appointment: savedAppointment,
			});
		} else {
			res.status(403).send("Access Denied");
		}
	} catch (error) {
		console.error("Error booking appointment:", error);
		res.status(400).send({
			message: "An error occurred while booking the appointment",
			error: error.message,
		});
	}
};
export const deleteAppointUser = async (req, res) => {
	const role = req.user.role;
	const userId = req.user._id;
	if (role == "admin" || role == "patient") {
		try {
			const appointment = await Appointment.findById(req.params.id);
			if (!appointment) {
				return res.status(404).json({ message: "Appointment not found" });
			}

			await Appointment.findByIdAndDelete(req.params.id);
			await user.findByIdAndUpdate(
				{ _id: userId },
				{ $pull: { appoints: appointment } },
				{ new: true }
			);
			await user.findByIdAndUpdate(
				{ _id: appointment.doctorId },
				{ $pull: { appoints: appointment } },
				{ new: true }
			);
			res.json({ message: "book deleted", data: [] });
		} catch (error) {
			console.error("Error deleting appointment:", error);
			res.status(500).json({
				message: "An error occurred while deleting the appointment",
				error: error.message,
			});
		}
	} else {
		res.status(403).json({
			message: "You do not have permission to delete this appointment",
		});
	}
};
export const deleteAppointDoctor = async (req, res) => {
	const role = req.user.role;
	const doctorId = req.user._id;

	if (role === "admin" || role === "nurse" || role === "doctor") {
		try {
			const appointment = await Appointment.findById(req.params.id);
			if (!appointment) {
				return res.status(404).json({ message: "Appointment not found" });
			}

			// Delete the appointment
			await Appointment.findByIdAndDelete(req.params.id);

			// Remove the appointment from the doctor's record
			await user.findByIdAndUpdate(
				doctorId,
				{ $pull: { appoints: appointment } },
				{ new: true }
			);
			await user.findByIdAndUpdate(
				appointment.patientId,
				{ $pull: { appoints: appointment } },

			)
			await user.findByIdAndUpdate(
				appointment.patientId,
				{
					$push: {
						appoints:
							{ appointmentId: appointment._id, status: "deleted" }
					}
				},

			)

			// Update the status of the appointment in the patient's record
			/**await user.findByIdAndUpdate(
				appointment.patientId,
				{ $set: { "appointments.$[elem].status": "deleted" } },
				{
					arrayFilters: [{ "elem.appointmentId": appointment._id }],
					new: true,
				}
			);*/

			const patient = await user.findById(appointment.patientId);

			const transporter = nodemailer.createTransport({
				service: "gmail",
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASSWORD,
				},

			})
			const mailOption = {
				from: process.env.MAIL_USER,
				to: patient.email,
				subject: "Appointment Deletion Notification",
				html: `<div>
                            <h3>Your appointment has been deleted</h3>
                            <p>We regret to inform you that your appointment scheduled for ${appointment.appointmentDate} has been deleted.</p>
                            <p>If you have any questions, please contact us.</p>
                        </div>`,
			}
			await transporter.sendMail(mailOption)


			res.json({ message: "Appointment deleted successfully", data: [] });
		} catch (error) {
			console.error("Error deleting appointment:", error);
			res.status(500).json({
				message: "An error occurred while deleting the appointment",
				error: error.message,
			});
		}
	} else {
		res.status(403).json({
			message: "You do not have permission to delete this appointment",
		});
	}
};

/**export const update = async (req, res) => {
	const role = req.user.role;
	const userId = req.user._id;
	if (role == "patient") {
		try {
			const appointmentId = req.params.id;
			const oldAppoint = await Appointment.findById(appointmentId)
			const newAppointment = req.body;
			await Appointment.findByIdAndUpdate(appointmentId, newAppointment);
			await user.findByIdAndUpdate(
				userId,
				{ $pull: { appointments: oldAppoint } } 
			);
			await user.findByIdAndUpdate(
				userId,
				{ $push: { appointments: newAppointment } } 
			);
			await user.findByIdAndUpdate(
				doctorId,
				{ $pull: { appointments: oldAppoint } } 
			);
			await user.findByIdAndUpdate(
				doctorId,
				{ $push: { appointments: newAppointment } } 
			);
			res.json({ message: "book update", data: newAppointment });
		} catch (error) {
			console.error("Error updating appointment:", error);
			res.status(500).json({
				message: "An error occurred while updating the appointment",
				error: error.message,
			});
		}
	} else {
		res.status(403).send("Access Denied");
	}
};*/
export const update = async (req, res) => {
	const role = req.user.role;
	const userId = req.user._id;

	if (role === "patient") {
		try {
			const appointmentId = req.params.id;
			const oldAppoint = await Appointment.findById(appointmentId);
			if (!oldAppoint) {
				return res.status(404).json({ message: "Appointment not found" });
			}

			const doctorId = oldAppoint?.doctorId;
			const newAppointment = req.body;

			// Update appointment
			const updatedAppointment = await Appointment.findByIdAndUpdate(
				appointmentId,
				/**{ $set: newAppointment },
				{ new: true } // Return updated document*/
				newAppointment
			);

			// Remove old appointment from patient
			await user.findByIdAndUpdate(
				userId,
				{ $pull: { appoints: oldAppoint } }
			);

			// Add updated appointment to patient
			await user.findByIdAndUpdate(
				userId,
				{ $push: { appoints: newAppointment } }
			);

			// Remove old appointment from doctor (if doctor exists)
			if (doctorId) {
				await user.findByIdAndUpdate(
					doctorId,
					{ $pull: { appoints: oldAppoint } }
				);

				// Add updated appointment to doctor
				await user.findByIdAndUpdate(
					doctorId,
					{ $push: { appoints: newAppointment } }
				);
			}

			res.json({ message: "Appointment updated successfully", data: updatedAppointment });

		} catch (error) {
			console.error("Error updating appointment:", error);
			res.status(500).json({
				message: "An error occurred while updating the appointment",
				error: error.message,
			});
		}
	} else {
		res.status(403).send("Access Denied");
	}
};

/**export const index = async (req, res) => {
	const role = req.user.role;
	if (role == "nurse" || role == "doctor") {
		try {
			const appointments = await Appointment.find();
			res.json({ message: "Appointments", data: appointments });
		} catch (error) {
			console.error("Error updating appointment:", error);
			res.status(500).json({
				message: "An error occurred while updating the appointment",
				error: error.message,
			});
		}
	} else {
		res.status(403).send("Access Denied");
	}
};*/
export const index = async (req, res) => {
	const role = req.user.role;
	const userId = req.user._id;

	if (role === "nurse" || role === "doctor") {
		try {
			// Filter based on user role
			let filter = {};
			if (role === "doctor") {
				filter = { doctorId: userId };
			} else if (role === "nurse") {
				filter = { nurseId: userId };
			}

			// Pagination setup
			const page = parseInt(req.query.page) || 1;
			const limit = 10; // Number of appointments per page
			const skip = (page - 1) * limit;

			// Fetch appointments with pagination & sorting
			const appointments = await Appointment.find(filter)
				.populate("patientId", "patientName ")
				.populate("doctorId", "doctorName ")
				//.populate("nurseId", "name email")
				.sort({ appointmentDate: 1 }) // Sorts by earliest appointment first
				.skip(skip)
				.limit(limit);

			// Check if no appointments found
			if (!appointments.length) {
				return res.status(404).json({ message: "No appointments found" });
			}

			res.json({ message: "Appointments retrieved successfully", data: appointments });
		} catch (error) {
			console.error("Error fetching appointments:", error);
			res.status(500).json({
				message: "An error occurred while fetching appointments",
				error: error.message,
			});
		}
	} else {
		res.status(403).json({ message: "Access Denied" });
	}
};

export const show = async (req, res) => {
	const id = req.params.id;
	try {
		const booking = await Appointment.findById(id);
		res.status(200).json({ message: " successful", data: booking });
	} catch (error) {
		res.status(400).json({ success: false, message: "failed" });
	}
};

