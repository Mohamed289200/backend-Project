import ADVICE from "../models/advice.model.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const listAdvices = async (req, res, next) => {
	try {
		const adviceList = await ADVICE.find();
		if (adviceList == null) {
			return next(errorHandler(404, "Advice list is empty")); // must be 200  ..good response but no data or 204
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
		return next(errorHandler(401, "please provide all required fields")); // must be 400 ... Bad request
	}
	if (description.length > 400) {
		return next(errorHandler(401, "description is too long")); /// must be 422 ... Unprocessable Entity
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
		return next(errorHandler(404, "Error while inserting the advice:" + error)); // must be 500 internal server error ..msg  An error occurred while creating the record. Please try again later
	}
};

export const updateAdvice = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(401, "please provide the ID of the advice")); // 400 bad request
	}
	try {
		const result = await ADVICE.findOneAndUpdate({ _id: id }, req.body, {
			new: true, // what is that ???
		});
		return res.status(200).json({
			data: result,
			message: "successfully updated",
			success: true,
		});
	} catch (error) {
		return next(errorHandler(404, "Error while updating the advice:" + error)); //500 interal  server error
	}
};

export const deleteAdvice = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(401, "please provide the ID of the advice")); // 400 bad request
	}
	try {
		const result = await ADVICE.findOneAndDelete({ _id: id });
		return res.status(200).json({
			//204 No Content
			success: true,
			message: "deleted successfully",
		});
	} catch (error) {
		return next(errorHandler(404, "Error while deleting the advice:" + error)); // 500 internal server error
	}
};
