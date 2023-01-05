// eslint-disable-next-line import/no-cycle
import ipLookUpHelper from './ip-lookup.helper';
import { googleTimezoneHelper } from './google-timezone.helper';
// eslint-disable-next-line import/no-cycle
import { googleGeocodeHelper } from './google-geocode.helper';
import { getUserLocationHelper } from './get-user-location.helper';

export interface GeolocationData {
	countryCode?: string;
	country: string;
	city?: string;
	state?: string;
	latitude: number;
	description?: string;
	address?: string;
	longitude: number;
	timezone?: string;
	utc_offset?: number;
	radius?: number;
	viewport?: any;
}

async function geolocateHelper(showTZ = true): Promise<GeolocationData | null> {
	if ('geolocation' in navigator) {
		try {
			const {
				coords: { longitude, latitude },
			} = await getUserLocationHelper();

			const geocodeRes = await googleGeocodeHelper({ location: { lat: latitude, lng: longitude } });

			if (showTZ) {
				const timezone = await googleTimezoneHelper(latitude, longitude);
				return Object.assign(geocodeRes, timezone);
			}
			return geocodeRes;
		} catch (e) {
			console.error('Geolocate geolocation error: ', e);
			return await ipLookUpHelper();
		}
	} else {
		console.error('Geolocate error: ', 'geolocation is not enabled on this browser');
		return ipLookUpHelper();
	}
}

export default geolocateHelper;
