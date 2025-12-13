const random = (choices) => {
	return choices[randomIndex(choices.length)];
};

export const randomIndex = (length) => {
	return Math.floor(Math.random() * length);
};

export const randomIndexLog = (max, log) => {
  return Math.floor(Math.log((Math.random() * (Math.pow(log, max)-1))+1) / Math.log(log));
};

export const randomIndexLogReverse = (max, log) => {
  return max - randomIndexLog(max, log) - 1;
};

export const randomLog = (choices, log = 2.0) => {
  return choices[randomIndexLog(choices.length, log)];
};

export const randomLogReverse = (choices, log = 2.0) => {
  return choices[randomIndexLogReverse(choices.length, log)];
};

export default random;
