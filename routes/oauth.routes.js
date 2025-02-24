import express from "express";
import User from "../models/userModel.js";
import { errorHandler } from "../helpers/errorHandler.js";
import { generateToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/google", (req, res) => {
	const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;
	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
	res.redirect(authUrl);
});

router.get("/google/callback", async (req, res, next) => {
	const { code } = req.query;
	const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;
	const tokenUrl = "https://oauth2.googleapis.com/token";

	try {
		const { data } = await axios.post(tokenUrl, {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
		});

		const { access_token } = data;

		const userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
		const { data: userInfo } = await axios.get(userInfoUrl, {
			headers: { Authorization: `Bearer ${access_token}` },
		});

		const { email } = userInfo;
		const user = await User.findOne({ email }).lean();
		if (!user) {
			next(errorHandler(404, "the email doesn't exist in the database"));
		}

		const token = generateToken(user);
		return res.redirect(`${process.env.CLIENT_URI}/home?token=${token}`);
	} catch (error) {
		console.error(
			"Google auth error:",
			error.response?.data || error.message
		);
		return next(errorHandler(500, error.message));
	}
});

export default router;
