// Convert colors from rgb to hex
export const toHexCode = rgb => {
	const values = rgb.replace(" ", "").split(",").map(x => Number(x));

	// add a 0 if the value in hex is only one digit
	return "#" + values.map(x => x >= 15 ? x.toString(16) : `0${x.toString(16)}`).join("");
};

// Convert colors from hex to rgb
export const toRGB = hex => {
	const h = hex.slice(1);
	const values = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];

	return values.map(x => parseInt(x, 16)).join();
}