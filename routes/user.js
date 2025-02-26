import express from "express";
import * as userController from "../controllers/user.js"; // Use import instead of require
import authenticateJWT from "../middlewares/auth.js";
const router = express.Router();

// Define your route
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// Use export default for the router
export default router;
