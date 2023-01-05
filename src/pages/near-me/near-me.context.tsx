import React, { useEffect, useState, createContext, useMemo } from 'react';
import { GeolocationData } from '@helpers/geolocate.helper';
import { getUserLocationHelper } from '@helpers/get-user-location.helper';
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { googleTimezoneHelper } from '@helpers/google-timezone.helper';
import ipLookUpHelper from '@helpers/ip-lookup.helper';
import { getCookie, setCookie } from '@helpers/storage.helper';
import LoadingComponent from '../../routes/loading.component';

interface DefaultContext {
	userLocation: GeolocationData | undefined;
	setUserLocation: (userLocation: GeolocationData) => void;
}

// @ts-ignore
export const NearMeContext = createContext<DefaultContext>();

export const DEFAULT_LOCATION = {
	countryCode: 'US',
	country: 'United States',
	city: 'New York',
	state: 'New York',
	latitude: 40.7127753,
	longitude: -74.0059728,
	timezone: 'America/New_York',
	utc_offset: -300,
};

export const NearMeContextProvider = ({ children }: { children: any }) => {
	const [userLocation, setUserLocation] = useState<GeolocationData>();
	const [loaded, setLoaded] = useState<boolean>(false);

	const geolocate = async (): Promise<void> => {
		try {
			const {
				coords: { longitude, latitude },
			} = await getUserLocationHelper({ timeout: 100 });
			// } = await getUserLocationHelper({ timeout: NODE_ENV === 'development' ? 10000 : 5000 });

			const location = await googleGeocodeHelper({ location: { lat: latitude, lng: longitude } }).then((res) =>
				googleTimezoneHelper(res.latitude, res.longitude).then((tzres) => ({ ...res, ...tzres }))
			);
			if (!location.country) throw new Error('no country after google geolocate');
			const clone = { ...location };
			delete clone.city;
			setUserLocation(clone);
		} catch (e) {
			const location = await ipLookUpHelper();
			const clone = { ...location };
			delete clone.city;
			setUserLocation(clone);
		}
	};

	useEffect(() => {
		try {
			const data = getCookie('userLocation');
			const cachedLocation = JSON.parse(data);
			if (!cachedLocation.country || !cachedLocation.city) throw new Error('wrong cache item');
			setUserLocation(cachedLocation);
		} catch (e) {
			if ('geolocation' in navigator) {
				geolocate().then();
			} else {
				const clone = { ...DEFAULT_LOCATION };
				delete clone.city;
				setUserLocation(clone);
			}
		} finally {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (userLocation && typeof userLocation.country !== 'undefined') {
			setCookie('userLocation', userLocation);
		}
	}, [userLocation]);

	const value = useMemo(
		() => ({
			userLocation,
			setUserLocation,
		}),
		[userLocation]
	);

	if (loaded) {
		return <NearMeContext.Provider value={value}>{children}</NearMeContext.Provider>;
	}

	return <LoadingComponent />;
};
