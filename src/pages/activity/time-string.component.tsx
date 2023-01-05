import React from 'react';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

interface TimeStringComponentProps {
	reservation: ReservationInterface | undefined | null;
	space: SpaceInterface | undefined;
}

export default function TimeStringComponent({ reservation, space }: TimeStringComponentProps) {
	let hoursString = '';
	if (!reservation || !space) return <>{hoursString}</>;

	const isUSA = reservation.tzLocation.indexOf('America') !== -1;
	const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

	if (space.spaceType.name === 'Weekpass') {
		const from = dayjs(reservation.hoursFrom).tz(reservation.tzLocation);
		const to = dayjs(reservation.hoursTo).tz(reservation.tzLocation);
		hoursString = `${from.format('D MMM YYYY')} - ${reservation.hoursTo ? to.format('D MMM YYYY') : 'Ongoing'}`;
	}

	if (space.spaceType.name === 'Daypass') {
		const from = dayjs(reservation.hoursFrom).tz(reservation.tzLocation);
		hoursString = `${from.format('D MMM YYYY')}`;
	}

	if (
		(space.spaceType.logicType && [SpaceTypeLogicType.HOURLY, SpaceTypeLogicType.MINUTELY].includes(space.spaceType.logicType)) ||
		space.eventData
	) {
		const from = dayjs(reservation.hoursFrom).tz(reservation.tzLocation);
		const to = dayjs(reservation.hoursTo).tz(reservation.tzLocation);
		hoursString = `${from.format('D MMM YYYY')} (${from.format(timeFormat)} - ${reservation.hoursTo ? to.format(timeFormat) : 'Ongoing'})`;
	}
	return <>{hoursString}</>;
}
