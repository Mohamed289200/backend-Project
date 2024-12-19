import express from "express";
import {
	index,
	store,
	update,
	destroy,
} from "../controllers/diesasesCategory.controller.js";

const router = express.Route();

router.get("/diesasescategory", index);
router.post("/diesasescategory", store);
router.patch("/diesasescategory", update);
router.delete("/diesasescategory", destroy);

export default router;
