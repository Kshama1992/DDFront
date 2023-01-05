// eslint-disable-next-line import/prefer-default-export
export const googleTimezoneHelper = (latitude: number, longitude: number): Promise<{ timezone: string; utc_offset: number }> =>
	fetch(
		`https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(
			Date.now() / 1000
		)}&language=en&key=${process.env.RAZZLE_RUNTIME_GOOGLE_API_KEY}`
	)
		.then((r) => r.json())
		.then((r) => ({ timezone: r.timeZoneId, utc_offset: r.rawOffset / 60 }));
