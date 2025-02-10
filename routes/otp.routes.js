import express from 'express';
import { resetPassword, sendOTP, verifyOTP } from "../controllers/otp.controller.js"

const router = express.Router();
router.post('/generation', sendOTP);
router.post('/verification', verifyOTP);
router.patch('/password', resetPassword);
export default router;