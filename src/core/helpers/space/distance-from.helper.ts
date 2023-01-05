import haversine from 'haversine';
import { getDistanceUnitByCountryCode } from './distance-unit.helper';

export default function distanceFromTo(
	countryCode: string,
	from: { latitude: number; longitude: number },
	to: { latitude: number; longitude: number }
) {
	const unit = getDistanceUnitByCountryCode(countryCode);

	const haversineUnit = unit === ' km' ? 'km' : 'mile';

	const distance = haversine(from, to, { unit: haversineUnit });

	return `${distance.toFixed(0)}${unit} away`;
}
