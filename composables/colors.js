// Convert colors from rgb to hex
export const toHexCode = rgb => {
	const values = rgb.replace(" ", "").split(",").map(x => Number(x));

	// add a 0 if the value in hex is only one digit
	return "#" + values.map(x => x >= 15 ? x.toString(16) : `0${x.toString(16)}`).join("");
};