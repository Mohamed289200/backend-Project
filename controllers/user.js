import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js'; 
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const existingUser  = await userModel.findOne({ email: req.body.email }); // Ensure you use req.body.email
        if (existingUser ) {
            return res.status(400).json({ message: "This email already exists" });
        }

        const newUser  = new userModel(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        newUser .password = hashedPassword;

        
        const user = await newUser .save(); 

        res.status(200).json({ message: "User  added successfully", user });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "An error occurred while registering the user" });
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