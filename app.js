import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from './routes/user.js';
// import User from "./models/userModel.js";
// import Treatment from "./models/treatmentModel.js";
// import Diseases from "./models/diseasesModel.js";
// import DiseasesCategory from "./models/diseasesCategory.js";
// import Advice from "./models/advice.js";
// import Appointment from "./models/appointmentModel.js";
dotenv.config();

// starting the server
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//APIs goes here
app.use('/', userRouter);
// app.post("/test", async (req, res) => {
// 	const { doctorId, patientId, nurseId, priority, appointmentDate, status } =
// 		req.body;
// 	const test = new Appointment({
// 		doctorId: doctorId,
// 		patientId: patientId,
// 		nurseId: nurseId,
// 		appointmentDate: appointmentDate,
// 		priority: priority,
// 		status: status,
// 	});
// 	try {
// 		await test.save();
// 		res.json({
// 			success: true,
// 			message: "good job",
// 			data: test,
// 		});
// 	} catch (error) {
// 		res.json({
// 			success: false,
// 			message: " mmmmm",
// 			error: error,
// 		});
// 	}
// });
//Error handler route
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});

mongoose
	.connect(process.env.DB_URL, {
		dbName: process.env.DB_NAME,
	})
	.then(() => {
		app.listen(process.env.PORT || 3000, () => {
			console.log("database is connected ✅");
			console.log("server is running ✅");
		});
	})
	.catch((error) => {
		console.log("Connection Failed" + " >>  " + error);
	});
