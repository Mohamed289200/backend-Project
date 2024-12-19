import express from "express";
import {
	index,
	store,
	update,
	destroy,
} from "../controllers/treatment.controller.js";

const router = express.Router();

router.get("/index", index);
router.post("/store", store);
router.patch("/update/:id", update);
router.delete("/destroy/:id", destroy);

export default router;
