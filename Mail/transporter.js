// Create the transporter once (e.g., in a separate config file)
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    throw new Error(
        "MAIL_USER and MAIL_PASSWORD must be defined in the environment variables."
    );
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

// Export the transporter for reuse
export default transporter;