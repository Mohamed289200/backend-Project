import TREATMENT from "../models/treatment.model.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const index = async (req, res, next) => {
	try {
		const Treatments = await TREATMENT.find();
		if (Treatments == null) {
			return next(errorHandler(204, "There aren't any Treatments"));
		}
		return res.status(200).json({
			data: Treatments,
			msg: "All Treatments are retrieved",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while retrieving the Treatment. Please try again later." +
					error
			)
		);
	}
};

export const store = async (req, res, next) => {
	const { diseaseID, name, description } = req.body;
	if (name == null || description == null || diseaseID == null) {
		return next(errorHandler(400, "All required fields must be provided."));
	}
	if (description.length > 500) {
		return next(
			errorHandler(
				422,
				'The field "description" exceeds the maximum length of 400 characters.'
			)
		);
	}
	try {
		const newTreatments = await TREATMENT({
			diseaseID,
			name,
			description,
		});
		const result = await newTreatments.save();
		return res.status(201).json({
			data: result,
			msg: "New Treatment has been created successfully",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while creating the Treatment. Please try again later." +
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
		const result = await TREATMENT.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		});
		return res.status(200).json({
			data: result,
			msg: "The Treatment has successfully updated",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while updating the Treatment. Please try again later." +
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
		const result = await TREATMENT.findOneAndDelete({ _id: id });
		return res.status(204).json({
			msg: "The Treatment has been successfully deleted",
			success: true,
		});
	} catch (error) {
		return next(
			errorHandler(
				500,
				"An error occurred while updating the Treatment. Please try again later." +
					error
			)
		);
	}
};
