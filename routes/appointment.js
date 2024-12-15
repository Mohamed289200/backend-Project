import express from 'express';
import { booking,getAppointment , deleteAppoint,updateappointment,getAllAppointment} from '../controllers/appointmentController.js'; 
import authintication from "../middlewares/auth.js"; 
const router = express.Router();

router.delete('/api/appointments/:id', authintication, deleteAppoint);
router.post('/api/doctors/:id/book', authintication, booking);
router.put('/api/appointments/:id', authintication, updateappointment);
router.get('/api/appointments', authintication, getAllAppointment);
router.get('/api/appointments/:id', authintication, getAppointment);

export default router;
