import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function sendEmail(user, subject, content) {
	console.log(process.env.MAIL_USER, process.env.MAIL_PASSWORD);

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
	const mailOptions = {
		from: {
			name: "noreply",
			address: process.env.MAIL_USER,
		},
		to: `${user}`,
		subject: `${subject}`,
		text: `${content}`,
		html: `<h2>${content}</h2>`,
	};
	try {
		await transporter.sendMail(mailOptions);
		console.log("email has been sent");
	} catch (error) {
		console.log(`error while sending the email:` + error);
	}
}
