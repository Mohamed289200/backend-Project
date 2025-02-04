import DISEASES from "../models/diseases.model.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const index = async (req, res, next) => {
	try {
		const diesases = await DISEASES.find();
		if (diesases == null) {
			return next(errorHandler(204, "There aren't any diesases"));
		}
		return res.status(200).json({
			data: diesases,
			msg: "All Diesases are retrieved",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while retrieving the Diseases. Please try again later." +
					error
			)
		);
	}
};

export const store = async (req, res, next) => {
	const { name, description, rank, diseasecategoryId } = req.body;
	if (
		name == null ||
		description == null ||
		rank == null ||
		diseasecategoryId == null
	) {
		return next(errorHandler(400, "All required fields must be provided."));
	}
	if (description.length > 400) {
		return next(
			errorHandler(
				422,
				'The field "description" exceeds the maximum length of 400 characters.'
			)
		);
	}
	try {
		const newDiesases = await DISEASES({
			name,
			description,
			rank,
			diseasecategoryId,
		});
		const result = await newDiesases.save();
		return res.status(201).json({
			data: result,
			msg: "New Diesase has been created successfully",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while creating the Disease. Please try again later." +
					error
			)
		);
	}
};

export const update = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(400, "All required fields must be provided."));
	}
	try {
		const result = await DISEASES.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		});
		return res.status(200).json({
			data: result,
			msg: "The Disease has successfully updated",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while updating the Disease. Please try again later." +
					error
			)
		);
	}
};

export const destroy = async (req, res, next) => {
	const { id } = req.params;
	if (id == null) {
		return next(errorHandler(400, "All required fields must be provided."));
	}
	try {
		const result = await DISEASES.findOneAndDelete({ _id: id });
		return res.status(204).json({
			msg: "The Disease has been successfully deleted",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while updating the Disease. Please try again later." +
					error
			)
		);
	}
};
