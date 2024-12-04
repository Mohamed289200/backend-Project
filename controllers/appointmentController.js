import user from '../models/userModel.js';
import appointmentModel from '../models/appointmentModel.js'
export const booking = async (req, res) => {
   
    try {
        const patientId = req.user._id; 
        const doctorId = req.body.doctorId;
        // const doctorId = req.params.id; 
        const role = req.user.role;
        if (role !== "admin" && role !== "hospital") {
           
            const {  nurseId, priority, appointmentDate } = req.body;
            const newAppoint = new appointmentModel({patientId, nurseId, doctorId, priority, appointmentDate});
            const savedAppointment = await newAppoint.save();
   res.status(200).json({ message: "Appointment booked successfully", appointment: savedAppointment });
        } else {
            res.status(403).send("Access Denied");
        }
    } catch (error) {
        console.error("Error booking appointment:", error); // Log the error for debugging
        res.status(400).send({ message: "An error occurred while booking the appointment", error: error.message });
    }
};
export const deleteAppoint = async (req,res)=>{
    const role = req.user.role;
    if (role == "admin" || role == "patient") {
    try {
       
        await appointmentModel.findByIdAndDelete(req.params.id)
        res.json({ message: "book deleted", data: [] })
        }
    catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "An error occurred while deleting the appointment", error: error.message });
    }}
    else {
        res.status(403).json({ message: "You do not have permission to delete this appointment" });
    }
}
export const updateappointment = async (req,res)=>{
    const role = req.user.role
   if(role == "patient"){
    try {
        const appointmentId= req.params.id
        const newAppointment = req.body
         await appointmentModel.findByIdAndUpdate(appointmentId, newAppointment)
        res.json({ message: "book update", data:newAppointment})}
        
    catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "An error occurred while updating the appointment", error: error.message });
  
   }}
   else{
        res.status(403).send("Access Denied")
    }
   
}