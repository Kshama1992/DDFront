// eslint-disable-next-line import/prefer-default-export
export function getDistanceUnitByCountryCode(countryCode: string): ' mi' | ' km' {
	switch (countryCode) {
		case 'GB':
		case 'US':
		case 'LR':
		case 'MM':
			return ' mi';
		default:
			return ' km';
	}
}
