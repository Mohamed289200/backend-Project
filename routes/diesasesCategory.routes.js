import express from "express";
import {
	index,
	store,
	update,
	destroy,
} from "../controllers/diesasesCategory.controller.js";

const router = express.Router();

router.get("/diesasescategory", index);
router.post("/diesasescategory", store);
router.patch("/diesasescategory/:id", update);
router.delete("/diesasescategory/:id", destroy);

export default router;
