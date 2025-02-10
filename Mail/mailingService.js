import transporter from "./transporter.js";

export default async function sendEmail(user, subject, content) {
	const mailOptions = {
		from: {
			name: "noreply",
			address: "MedEase Team",
		},
		to: `${user}`,
		subject: `${subject}`,
		text: `${content}`,
		html: otpTemplate(user, content),
	};
	try {
		await transporter.sendMail(mailOptions);
		console.log("email has been sent");
	} catch (error) {
		console.log(`error while sending the email:` + error);
	}
}
