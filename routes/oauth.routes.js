import express from "express";
import User from "../models/userModel.js"
import { errorHandler } from "../helpers/errorHandler.js";
import { generateToken } from "../middlewares/auth.js";

const router = express.Router();
// Google OAuth Routes
router.get("/google", (req, res) => {
	const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;
	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
	res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
	const { code } = req.query;
	const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;
	const tokenUrl = "https://oauth2.googleapis.com/token";

	try {
		// Exchange code for access token
		const { data } = await axios.post(tokenUrl, {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
		});

		const { access_token } = data;

		// Fetch user info
		const userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
		const { data: userInfo } = await axios.get(userInfoUrl, {
			headers: { Authorization: `Bearer ${access_token}` },
		});

		const { email, name, sub: providerId } = userInfo;

		// Handle signup/login logic
		const user = await User.findOne({email}).lean();
        if(!user){
            errorHandler(404,"the email doesn't exist in the database")
        }
		const token = generateToken(user);

		// Redirect to frontend homepage with token
		return res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
	} catch (error) {
		console.error(
			"Google auth error:",
			error.response?.data || error.message
		);
		res.status(500).send("Authentication failed");
	}
});

export default router;
