const userName = "John Doe";
const otp = "123456";
const expirationTime = "10 minutes";
const currentYear = new Date().getFullYear();

function otpTemplate(userName, otp) {
	const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for <strong>${expirationTime}</strong>. Please do not share this code with anyone.</p>
            <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
        </div>
        <div class="footer">
            <p>&copy; ${currentYear} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
	return emailTemplate;
}