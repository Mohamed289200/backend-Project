//TODO: work on expiration time later
//TODO: styling
export const otpTemplate = (userName, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        
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
            <p>This OTP is valid for <strong>10 min</strong>. Please do not share this code with anyone.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
