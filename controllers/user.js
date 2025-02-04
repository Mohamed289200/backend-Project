
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js"; // Ensure the path and extension are correct
import jwt from "jsonwebtoken";
import generateOTP from "../helpers/generateOTP.js";
import sendEmail from "../Mail/mailingService.js";

export const register = async (req, res) => {
	try {
		const existingUser = await userModel.findOne({ email: req.body.email }); // Ensure you use req.body.email
		if (existingUser) {
			return res.status(400).json({ message: "This email already exists" });
		}

		const newUser = new userModel(req.body);
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		newUser.password = hashedPassword;

// Save the user and wait for the result
		const user = await newUser.save(); // Make sure to await the save operation


		res.status(200).json({ message: "User  added successfully", user });
	} catch (error) {
		console.error(error); // Log the error for debugging
		res.status(500).json({
			message: "An error occurred while registering the user",
		});
	}
};



export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const passwordCheck = await user.comparePassword(req.body.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
  
        jwt.sign(
            { _id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, 
            (error, token) => {
                if (error) {
                    console.error('Error signing token:', error);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.header('token', token, { httpOnly: true })
                    .status(201)
                    .json({
                        _id: user._id,
                        name: user.name,
                        token, 
                    });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while logging in" });
    }
};

/*export const login = async (req, res) => {
	try {
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			res.status(400).json({ message: "invalid email or password" });
		}
		const passwordCheck = await user.comparePassword(req.body.password);
		if (!passwordCheck) {
			res.status(400).json({ message: "invalid email or password" });
		}
		jwt.sign(
			{ _id: user._id, name: user.name, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }, // Set token expiration
			(error, token) => {
				if (error) {
					console.error("Error signing token:", error);
					return res.status(500).json({ message: "Internal server error" });
				}

				// Set the token in a cookie and respond
				res
					.cookie("token", token, { httpOnly: true }) // Set httpOnly for security
					.status(201)
					.json({
						_id: user._id,
						name: user.name, // Optionally return the user's name
					});
			}
		);
		res.status(200).json({ message: "user Logged in" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while logging in" });
	}
};*/
export const sendOTP = async (req, res) => {
	const email = req.body?.email;
	if (email == null) {
		return res.status(403).json({
			success: false,
			message: "please provide an email",
			data: null,
		});
	}
	try {
		const user = await userModel.findOne({ email });
		if (user == null) {
			return res.status(404).json({
				success: false,
				message: "your email doesn't exist in the database",
				data: null,
			});
		}
		const OTP = generateOTP();

		await sendEmail(email, "Your OTP", OTP);

		return res.status(201).json({
			success: true,
			message: "OTP has been sent",
			data: OTP,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "internal server error",
			data: `${error}`,
		});
	}
};

export const resetPassword = async (req, res) => {
	const email = req.body?.email;
	const password = req.body?.password;
	if (email == null || password == null) {
		return res.status(403).json({
			success: false,
			message: "please provide all required data",
			data: null,
		});
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await userModel.findOneAndUpdate(
			{ email },
			{ password: hashedPassword },
			{ new: true }
		);
		return res.status(200).json({
			success: true,
			message: "user password has been updated",
			date: user,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "internal server error",
			data: `${error}`,
		});
	}
};
