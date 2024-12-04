import ADVICE from "../models/advice.model.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const listAdvices = async (req, res, next) => {
	try {
		const adviceList = await ADVICE.find();
		if (adviceList == null) {
			return next(errorHandler(404, "Advice list is empty"));
		}
		return res.status(200).json({
			data: adviceList,
			message: "advices fetched successfully",
			success: true,
		});
	} catch (error) {
		return next(errorHandler(404, "Error while fetching advices:" + error));
	}
};

export const addAdvice = async (req, res, next) => {
	const { doctorId, diseasesCategoryId, description } = req.body;
	if (doctorId == null || diseasesCategoryId == null || description == null) {
		return next(errorHandler(401, "please provide all required fields"));
	}
	if (description.length > 400) {
		return next(errorHandler(401, "description is too long"));
	}
	try {
		const newAdvice = await new ADVICE({
			doctorId,
			diseasesCategoryId,
			description,
		});
		const result = await newAdvice.save();
		return res.status(201).json({
			data: result,
			message: "successfully inserted",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(404, "Error while inserting the advice:" + error)
		);
	}
};

export const updateAdvice = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(401, "please provide the ID of the advice"));
	}
	try {
		const result = await ADVICE.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		});
		return res.status(200).json({
			data: result,
			message: "successfully updated",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(404, "Error while updating the advice:" + error)
		);
	}
};

export const deleteAdvice = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(401, "please provide the ID of the advice"));
	}
	try {
		const result = await ADVICE.findOneAndDelete({ _id: id });
		return res.status(200).json({
			success: true,
			message: "deleted successfully",
		});
	} catch (error) {
		return next(
			errorHandler(404, "Error while deleting the advice:" + error)
		);
	}
};
