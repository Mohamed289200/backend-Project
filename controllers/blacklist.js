const blacklist = new Set();

export const addToBlacklist = (token) => {
	blacklist.add(token);
};

export const isTokenInBlacklist = (token) => {
	return blacklist.has(token);
};
