const currencyRegex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

export const validateCurrency = (value: string) => {
	const decimal = value.indexOf('.');
	const correctLength =
		decimal > -1 ? Math.min(2, value.length - decimal) + decimal + 1 : value.length;
	if (!currencyRegex.test(value)) value = value.substring(0, correctLength);

	return padDecimal(value);
};

export const padDecimal = (value: string) => {
	const decimalIdx = value.lastIndexOf('.');
	const { length } = value;

	if (decimalIdx != -1 && length - decimalIdx < 3) {
		return value.padEnd(2 * length - decimalIdx - 1, '0');
	} else if (length == 3 && decimalIdx == 0) {
		return `0${value}`;
	} else if (decimalIdx == -1) {
		return `${value}.00`;
	}

	return value;
};

export const round = (value: number) => {
	const roundedValue = Math.round(value * 100) / 100;
	if (isNaN(roundedValue)) return value;
	return roundedValue;
};

export const Euro = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'EUR'
});
