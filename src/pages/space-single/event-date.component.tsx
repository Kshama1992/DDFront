import React, { useContext } from 'react';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { formatFromTo } from '@helpers/space/space-hours.helper';
import { AuthContext } from '@context/auth.context';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

export default function EventDateComponent({ space }: { space: SpaceInterface }) {
	const { isBrandAdmin, isSuperAdmin } = useContext(AuthContext);
	if (!space.eventData) return <></>;
	const isAdminView = isBrandAdmin || isSuperAdmin;

	const timezone = space.venue.tzId;

	let day = dayjs.tz(
		`${dayjs(space.eventData.date).format('YYYY-MM-DD')} ${space.eventData.accessHoursFrom}`,
		'YYYY-MM-DD HH:mm:ss',
		space.venue.tzId
	);
	if (!isAdminView) day = day.tz(timezone);

	return (
		<>
			{day.format('D MMM')}
			{formatFromTo({
				accessHoursFrom: space.eventData.accessHoursFrom,
				accessHoursTo: space.eventData.accessHoursTo,
				tzId: space.venue.tzId,
				timezone,
			})}
		</>
	);
}
