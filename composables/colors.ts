/** Convert colors from rgb to hex */
export const toHexCode = (rgb: string): string => {
	const values = rgb.replace(" ", "").split(",").map(x => Number(x));

	// add a 0 if the value in hex is only one digit
	return "#" + values.map(x => x >= 15 ? x.toString(16) : `0${x.toString(16)}`).join("");
};

/** Convert colors from hex to rgb */
export const toRGB = (hex: string): string => {
	const h = hex.slice(1);
	const values = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];

	return values.map(x => parseInt(x, 16)).join();
}

/** Convert RGB string from backend to CSS format */
export const toCSSColor = (rgbString: string): string => {
	if (!rgbString) return '';

	// Handle hex colors (if they start with #)
	if (rgbString.startsWith('#')) {
		return rgbString;
	}

	// Handle RGB strings like "34,197,94"
	if (rgbString.includes(',')) {
		return `rgb(${rgbString})`;
	}

	// Return as-is if already in a valid CSS format
	return rgbString;
}
