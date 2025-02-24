import express from "express";

const router = express.Router();
// Google OAuth Routes
router.get("/google", (req, res) => {
	const redirectUri = `${process.env.BASE_URL}/auth/google/callback`;
	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
	res.redirect(authUrl);
});

export default router;
