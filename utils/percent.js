export function toPercent(number) {
	try {
		return Math.round((number + Number.EPSILON) * 100)
	} catch (error) {
		console.error(error);
	}
}