import express from 'express';
import { booking,getAppointment , deleteAppoint,updateappointment,getAllAppointment} from '../controllers/appointmentController.js'; 
import authintication from "../middlewares/auth.js"; 
const router = express.Router();

router.delete('/api/delete', authintication, deleteAppoint);
router.post('/api/doctors/:id/book', authintication, booking);
router.put('/api/update', authintication, updateappointment);
router.get('/api/appointments', authintication, getAllAppointment);
router.get('/api/appointment', authintication, getAppointment);

export default router;
