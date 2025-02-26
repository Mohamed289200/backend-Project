import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
	const fullToken = req.headers.authorization;
	if (!fullToken) {
		return res.status(403).json({ message: "Access denied" });
	}
	const token = fullToken.split(" ")[1];
	if (!token) {
		return res.status(403).json({ message: "Access denied" });
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}
		req.user = decodedToken;
		next();
	});
};

export const generateToken = async (user) => {
	const token = jwt.sign(
		{ _id: user._id, name: user.name, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "1h" }
	);
	return token;
};
export default authenticateJWT;
