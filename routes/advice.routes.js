import express from "express";
import {
	addAdvice,
	deleteAdvice,
	listAdvices,
	updateAdvice,
} from "../controllers/advice.controller.js";
const router = express.Router();

router.get("/list", listAdvices);
router.post("/addition", addAdvice);
router.patch("/modification/:id", updateAdvice);
router.delete("/deletion/:id", deleteAdvice);
export default router;
