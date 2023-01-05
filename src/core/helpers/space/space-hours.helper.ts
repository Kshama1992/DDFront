import dayjs, { Dayjs, extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

export const dateWithTz = (dateString: string | undefined, tzId: string): Dayjs => {
	if (!dateString) return dayjs();
	return dayjs(dateString).tz(tzId);
};

export const formatFromTo = ({
	accessHoursFrom,
	accessHoursTo,
	tzId,
	timezone,
	useTZ = true,
}: {
	accessHoursFrom: any | undefined;
	accessHoursTo: any | undefined;
	tzId: string;
	timezone: string;
	useTZ?: boolean;
}) => {
	let isUSA = timezone.indexOf('America') !== -1;

	let timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

	if (!useTZ) {
		isUSA = tzId.indexOf('America') !== -1;

		timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

		const from = dayjs(`${dayjs().format('YYYY-MM-DD')} ${accessHoursFrom}`);
		const to = dayjs(`${dayjs().format('YYYY-MM-DD')} ${accessHoursTo}`);
		return `${from.format(timeFormat)} - ${to.format(timeFormat)}`;
	}

	const from = dayjs.tz(`${dayjs().format('YYYY-MM-DD')} ${accessHoursFrom}`, tzId).tz(timezone);
	const to = dayjs.tz(`${dayjs().format('YYYY-MM-DD')} ${accessHoursTo}`, tzId).tz(timezone);

	return `${from.format(timeFormat)} - ${to.format(timeFormat)}`;
};

export function venueAccessHours(venue: VenueInterface): string {
	const { accessCustom, accessHoursFrom, accessHoursTo, accessCustomData, tzId } = venue;

	const timezone = tzId;

	try {
		if (accessCustom) {
			const dayOfWeek = dayjs().format('dddd');

			const todayAccessData = accessCustomData?.find((acd) => acd.weekday === dayOfWeek);

			if (typeof todayAccessData === 'undefined' || !todayAccessData.open) return 'Closed';

			const { accessHoursFrom: todayAccessHoursFrom, accessHoursTo: todayAccessHoursTo } = todayAccessData;

			return formatFromTo({
				accessHoursFrom: todayAccessHoursFrom,
				accessHoursTo: todayAccessHoursTo,
				tzId,
				timezone,
			});
		}

		return formatFromTo({ accessHoursFrom, accessHoursTo, tzId, timezone });
	} catch (e) {
		console.error(e);
		return '';
	}
}
