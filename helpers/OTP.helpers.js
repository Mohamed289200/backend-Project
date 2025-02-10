import bcrypt from "bcrypt";

export function generateOTP(params) {
	return crypto.randomInt(100000, 999999);
}

export async function hashOTP(otp) {
	const saltRounds = 10;
	return await bcrypt.hash(String(otp), saltRounds);
}

export async function compareOTP(submittedOTP, storedHash) {
	return await bcrypt.compare(String(submittedOTP), storedHash);
}
