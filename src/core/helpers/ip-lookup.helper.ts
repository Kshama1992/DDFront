// eslint-disable-next-line import/no-cycle
import { GeolocationData } from './geolocate.helper';
// eslint-disable-next-line import/no-cycle
import { DEFAULT_LOCATION } from '../context/auth.context';

// eslint-disable-next-line import/prefer-default-export
async function ipLookUpHelper(): Promise<GeolocationData> {
	try {
		return await fetch('https://ipapi.co/json/')
			.then((r) => r.json())
			.then((result) => {
				const { country, country_name: countryName, city, state, latitude, longitude, timezone, utc_offset: utcOffset } = result;

				if (result.error) return DEFAULT_LOCATION;

				return {
					countryCode: country,
					country: countryName,
					city,
					state,
					latitude,
					longitude,
					timezone,
					utc_offset: parseFloat(utcOffset),
				};
			})
			.catch(() => DEFAULT_LOCATION);
	} catch (e) {
		console.error('Geolocate error: ', e);
		// throw new Error(e.message);
		return DEFAULT_LOCATION;
	}
}

export default ipLookUpHelper;
