import express from 'express';
import { booking , deleteAppoint,updateappointment} from '../controllers/appointmentController.js'; 
import authintication from "../middlewares/auth.js"; 
const router = express.Router();

router.delete('/api/delete', authintication, deleteAppoint);
router.post('/api/book', authintication, booking);
router.put('/api/update', authintication, updateappointment);
export default router;