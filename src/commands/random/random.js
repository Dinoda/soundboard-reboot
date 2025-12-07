const random = (choices) => {
	return choices[randomIndex(choices.length)];
};

export const randomIndex = (length) => {
	return Math.floor(Math.random() * length);
};

export default random;
