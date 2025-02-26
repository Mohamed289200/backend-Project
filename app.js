import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rateLimter from "express-rate-limit";
import userRouter from "./routes/user.js";
import otpRouter from "./routes/otp.routes.js";
import appointmentRouter from "./routes/appointment.js";
import helmet from "helmet";
import adviceRouter from "./routes/advice.routes.js";
import diseasesCategoryRouter from "./routes/diseasesCategory.routes.js";
import diseasesRouter from "./routes/diseases.routes.js";
import treatmentRouter from "./routes/treatmnet.routes.js";

dotenv.config();

// starting the server
const app = express();
const Limter = rateLimter({
	windowMs: 1000 * 60 * 15,
	max: 20,
	message: "Too many requests ,try again later",
});

// app.use(
// 	cors({
// 		origin: "https://localhost:",
// 		methods: [*],
// 		allowedHeaders: [*],
// 		credentials: true, // Allow cookies (if needed)
// 	})
// );

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Limter);
app.use(helmet());
//APIs goes here

app.use("/api", userRouter);

app.use("/api/advice", adviceRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/diseasescategory", diseasesCategoryRouter);
app.use("/api/diseases", diseasesRouter);
app.use("/api/treatment", treatmentRouter);

app.use("/api/otp", otpRouter);

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
