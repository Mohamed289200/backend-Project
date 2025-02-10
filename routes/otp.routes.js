import express from 'express';

const router = express.Router();
router.post('/api/otp', userController.sendOTP);

export default router;