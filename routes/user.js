import express from 'express';
import * as userController from '../controllers/user.js'; // Use import instead of require

const router = express.Router();

// Define your route
router.post('/api/register', userController.register);
router.post('/api/login', userController.login);
router.post('/api/otp', userController.sendOTP);
// router.patch('/api/password', userController.resetPassword);

// Use export default for the router
export default router;