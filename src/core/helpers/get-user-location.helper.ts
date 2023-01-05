interface UserLocationOptions {
	maximumAge?: number;
	timeout?: number;
	enableHighAccuracy?: boolean;
}

export const getUserLocationHelper = (options?: UserLocationOptions): Promise<GeolocationPosition> =>
	new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
