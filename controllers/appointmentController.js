import user from '../models/userModel.js';
import Appointment from '../models/appointmentModel.js'
import { populate } from 'dotenv';
export const booking = async (req, res) => {

    try {

        const patientId = req.user._id;
        // const doctorId = req.body.doctorId;
        const doctorId = req.params.id;
        const role = req.user.role;

        if (role !== "admin" && role !== "hospital") {

            const { nurseId, priority, appointmentDate } = req.body;
            const appoint = new Appointment({ patientId, nurseId, doctorId, priority, appointmentDate });
            const savedAppointment = await appoint.save();
            const doctor = await user.findById(doctorId)
            if (!doctor) {
                console.error(`doctor not found with id ${doctorId}`)
                return res.status(404).json({ success: false, message: "Tour not found" })
    
            }
            await doctor.updateOne({
                $push: { appointments: savedAppointment._id } 
            })

            res.status(200).json({ message: "Appointment booked successfully", appointment: savedAppointment });

           
           /* await doctor.populate({
                path:'appointments',
                populate:[
                    {path : 'patientId' ,select :'name email' }
                ]
            }).execPopulate();*/


        } else {
            res.status(403).send("Access Denied");
        }
    } catch (error) {
        console.error("Error booking appointment:", error); // Log the error for debugging
        res.status(400).send({ message: "An error occurred while booking the appointment", error: error.message });
    }
};
export const deleteAppoint = async (req, res) => {
    const role = req.user.role;
    if (role == "admin" || role == "patient") {
        try {

            await Appointment.findByIdAndDelete(req.params.id)
            res.json({ message: "book deleted", data: [] })
        }
        catch (error) {
            console.error("Error deleting appointment:", error);
            res.status(500).json({ message: "An error occurred while deleting the appointment", error: error.message });
        }
    }
    else {
        res.status(403).json({ message: "You do not have permission to delete this appointment" });
    }
}
export const updateappointment = async (req, res) => {
    const role = req.user.role
    if (role == "patient") {
        try {
            const appointmentId = req.params.id
            const newAppointment = req.body
            await Appointment.findByIdAndUpdate(appointmentId, newAppointment)
            res.json({ message: "book update", data: newAppointment })
        }

        catch (error) {
            console.error("Error updating appointment:", error);
            res.status(500).json({ message: "An error occurred while updating the appointment", error: error.message });

        }
    }
    else {
        res.status(403).send("Access Denied")
    }

}
export const getAllAppointment = async (req, res) => {
    const role = req.user.role
    if (role == "nurse" || role == "doctor") {
        try {

            const appointments = await Appointment.find()
            res.json({ message: "Appointments", data: appointments })
        }

        catch (error) {
            console.error("Error updating appointment:", error);
            res.status(500).json({ message: "An error occurred while updating the appointment", error: error.message });

        }
    }
    else {
        res.status(403).send("Access Denied")
    }

}
export const getAppointment = async (req, res) => {
    const id = req.params.id
    try {
        const booking = await Appointment.findById(id)
        res.status(200).json({ message: " successful", data: booking })
    } catch (error) {
        res.status(400).json({ success: false, message: "deketed failed" })

    }
}