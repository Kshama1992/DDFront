// eslint-disable-next-line import/no-cycle
import { DEFAULT_LOCATION } from '@context/auth.context';
// eslint-disable-next-line import/no-cycle
import { GeolocationData } from './geolocate.helper';

export interface GeocodeParams {
	address?: string;
	placeId?: string;
	location?: google.maps.LatLngLiteral;
	bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
	componentRestrictions?: any;
	region?: string;
}

export const getAddressValue = (
	address: google.maps.GeocoderAddressComponent[],
	addressKey: string,
	shortOrLong: 'short_name' | 'long_name'
): string => {
	const value = address.find((add) => add.types.indexOf(addressKey) > -1);
	if (!value) return '';
	return value[shortOrLong];
};

export const getGoogleCity = (input: google.maps.GeocoderResult[]): google.maps.GeocoderResult | undefined => {
	const locality = input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'locality')[0];
	if (locality) return locality;
	const postalTown = input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'postal_town')[0];
	if (postalTown) return postalTown;
	const neighborhood = input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'neighborhood')[0];
	if (neighborhood) return neighborhood;
	const establishment = input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'establishment')[0];
	if (establishment) return establishment;
	return undefined;
};

export const getGoogleCountry = (input: google.maps.GeocoderResult[]) => input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'country')[0];
export const getGoogleState = (input: google.maps.GeocoderResult[]) =>
	input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'administrative_area_level_1')[0];

export const getViewportRadius = (viewport?: google.maps.LatLngBounds | undefined | null) => {
	if (viewport) {
		const r = 6378.8;
		const neLat = viewport.getNorthEast().lat() / 57.2958;
		const neLng = viewport.getNorthEast().lng() / 57.2958;
		const cLat = viewport.getCenter().lat() / 57.2958;
		const cLng = viewport.getCenter().lng() / 57.2958;
		const rKm = r * Math.acos(Math.sin(cLat) * Math.sin(neLat) + Math.cos(cLat) * Math.cos(neLat) * Math.cos(neLng - cLng));
		return (rKm + 1) * 1000;
	}
	return 100000;
};

export const googleGeocodeHelper = async (params: GeocodeParams): Promise<GeolocationData> => {
	const geocoder = new google.maps.Geocoder();

	return new Promise((resolve) => {
		// @ts-ignore
		geocoder.geocode(params, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
			if (status === google.maps.GeocoderStatus.OK) {
				const city = getGoogleCity(results);
				const state = getGoogleState(results);
				const country = getGoogleCountry(results);
				let viewport;

				if (country) viewport = country.geometry.viewport || country.geometry.bounds;
				if (state) viewport = state.geometry.viewport || state.geometry.bounds;
				if (city) viewport = city.geometry.viewport || city.geometry.bounds;

				const radius = getViewportRadius(viewport);

				resolve({
					countryCode: getAddressValue(results[0].address_components, 'country', 'short_name'),
					country: getAddressValue(results[0].address_components, 'country', 'long_name'),
					city:
						getAddressValue(results[0].address_components, 'locality', 'long_name') ||
						getAddressValue(results[0].address_components, 'postal_town', 'long_name') ||
						getAddressValue(results[0].address_components, 'neighborhood', 'long_name') ||
						getAddressValue(results[0].address_components, 'establishment', 'long_name'),
					state: getAddressValue(results[0].address_components, 'administrative_area_level_1', 'long_name'),
					latitude: results[0].geometry.location.lat(),
					longitude: results[0].geometry.location.lng(),
					radius,
				});
			} else {
				resolve(DEFAULT_LOCATION);
			}
		});
	});
};
