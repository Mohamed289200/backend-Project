import ADVICE from "../models/advice.model.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const index = async (req, res, next) => {
	try {
		const adviceList = await ADVICE.find().lean();
		if (adviceList.length === 0) {
			return next(errorHandler(200, "Advice list is empty"));
		}
		return res.status(200).json({
			data: adviceList,
			message: "advices fetched successfully",
			success: true,
		});
	} catch (error) {
		return next(errorHandler(500, "Error while fetching advices:" + error));
	}
};

export const store = async (req, res, next) => {
	const { doctorId, diseasesCategoryId, description } = req.body;
	if (doctorId == null || diseasesCategoryId == null || description == null) {
		return next(errorHandler(400, "Please provide all required fields"));
	}
	if (description.length > 400) {
		return next(errorHandler(422, "Description is too long"));
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
		return next(errorHandler(500, "Error while inserting the advice:" + error));
	}
};

export const update = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(400, "please provide the ID of the advice"));
	}
	try {
		const result = await ADVICE.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		}).lean();
		return res.status(200).json({
			data: result,
			message: "successfully updated",
			success: true,
		});
	} catch (error) {
		return next(errorHandler(500, "Error while updating the advice:" + error.message));
	}
};

export const destroy = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (id == null) {
			return next(errorHandler(400, "Please provide the ID of the advice"));
		}
		await ADVICE.findOneAndDelete({ _id: id });
		return res.status(200).json({
			success: true,
			message: "deleted successfully",
		});
	} catch (error) {
		return next(errorHandler(500, "Error while deleting the advice:" + error.message));
	}
};
