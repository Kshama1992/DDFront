import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceAvailability from 'dd-common-blocks/dist/interface/space-availability.interface';
import dayjs, { Dayjs, extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import minMax from 'dayjs/plugin/minMax';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import SpaceAvailabilityItem from 'dd-common-blocks/dist/interface/space-availability-item.interface';
import Button from '@mui/material/Button';
import SpaceInterface from 'dd-common-blocks/lib/interface/space.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import CircularProgress from '@mui/material/CircularProgress';
import SpaceService from '@service/space.service';
import { AuthContext } from '@context/auth.context';
import { dateWithTz } from '@helpers/space/space-hours.helper';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);
extend(isSameOrAfter);
extend(isSameOrBefore);
extend(minMax);
extend(isBetween);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		chooseDatesHolder: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
		},
		timeBadge: {
			position: 'absolute',
			top: -1,
			right: -1,
			background: '#e0e0e0',
			color: '#fff',
			width: 'calc(100% + 2px) !important',
			fontSize: 10,
			textTransform: 'uppercase',
			lineHeight: '12px',
			borderTopLeftRadius: 5,
			borderTopRightRadius: 5,
		},
		timeBtn: {
			borderRadius: 3,
			color: theme.palette.primary.main,
			fontSize: 18,
			display: 'inline-block',
			padding: '10px 9px 10px 9px',
			width: 125,
			marginBottom: 10,
			[theme.breakpoints.down('md')]: {
				width: '32%',
			},
		},
		timeBtnActive: {
			borderRadius: 3,
			backgroundColor: theme.palette.primary.main,
			color: '#fff',
			fontSize: 18,
			display: 'inline-block',
			padding: '10px 9px 10px 9px',
			width: 125,
			marginBottom: 10,
			[theme.breakpoints.down('md')]: {
				width: '32%',
				'&:hover': {
					background: theme.palette.primary.main,
				},
			},
		},
	})
);

interface SelectReservationTimeComponentProps {
	date: string | undefined;
	startTime?: Dayjs | undefined;
	space: SpaceInterface | undefined;
	onTimeSelected: (time: string) => any;
	userId?: string | number | undefined;
	type?: 'start' | 'end';
	tzId: string;
	excludeReservationId?: number | undefined;
}

export default function SelectReservationTimeComponent({
	type = 'start',
	startTime,
	space,
	userId,
	date,
	onTimeSelected,
	tzId,
	excludeReservationId,
}: SelectReservationTimeComponentProps) {
	const classes = useStyles({});
	const spaceService = new SpaceService();

	const { authBody } = useContext(AuthContext);
	const [selectedTime, setSelectedTime] = useState<string | undefined>();
	const [spaceAvailability, setSpaceAvailability] = useState<SpaceAvailability[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	dayjs.tz.setDefault(tzId);

	const loadAvailability = useCallback(async () => {
		if (!authBody || !space) return;
		setIsLoading(true);
		try {
			const availability = await spaceService.availability(space.id!, {
				userId: userId || authBody.id!,
				startDate: dayjs(date).format('YYYY-MM-DD'),
				endDate: dayjs(date).format('YYYY-MM-DD'),
				userTZ: tzId,
				excludeReservationId,
			});

			setSpaceAvailability(availability);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const isUSA = tzId.indexOf('America') !== -1;
	const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

	useEffect(() => {
		loadAvailability().then();
	}, []);

	const isTimeEnabled = (value: any, toTime: Dayjs): { isMinTime?: boolean; reserved?: boolean; disabled?: boolean } => {
		if (!space || value === '' || !startTime) return {};
		if (dayjs(value).isSame(toTime)) return { isMinTime: true, reserved: true };
		if (space.roundHours > 0 && startTime) {
			const maxTime = startTime.add(space.roundHours, 'hour').subtract(1, 's');
			return { isMinTime: dayjs(value).isBefore(maxTime) };
		}
		return { disabled: dayjs(value).isBefore(startTime) };
	};

	/**
	 * Get available times by date
	 * @param {string | Dayjs} inputDate
	 */
	const getAvailableByDate = (inputDate: string | Dayjs | undefined): SpaceAvailabilityItem[] => {
		if (!inputDate) return [];
		const spaceAvailabilityDate: SpaceAvailability | undefined = spaceAvailability.find(
			(sa) => sa.date === dayjs(inputDate).format('YYYY-MM-DD')
		);
		if (spaceAvailabilityDate) return spaceAvailabilityDate.items;
		return [];
	};

	const filterFromStartTime = (): SpaceAvailabilityItem[] => {
		if (!startTime || !date) return [];
		const times = getAvailableByDate(date);
		const maxTime = dayjs.max(times.map((v) => dayjs(v.value)));

		return times.map((i: SpaceAvailabilityItem) => {
			let reserved = i.reserved;
			if (
				dayjs(i.value).isSameOrAfter(startTime) &&
				dayjs(i.value).isSameOrBefore(startTime.add(space!.roundHours > 0 ? space!.roundHours - 0.5 : 0, 'hour'))
			) {
				reserved = true;
			}
			return {
				...i,
				reserved,
				...isTimeEnabled(i.value, maxTime.add(1, 's')),
			};
		});
	};

	const isStartTime = (item: SpaceAvailabilityItem): boolean => {
		if (!startTime || !space) return false;
		return dateWithTz(item.value, tzId).isSame(startTime);
	};

	const isReserved = (item: SpaceAvailabilityItem): boolean => {
		if (!space || space.spaceType.logicType === SpaceTypeLogicType.MINUTELY) return false;
		if (type === 'start') return item.reserved && !item.isMinTime;
		return item.reserved && !dateWithTz(item.value, tzId).isSame(startTime);
	};

	const handleSelectTime = (time: string) => {
		setSelectedTime(time);
		onTimeSelected(time);
	};
	if (!space) return <></>;

	return (
		<div className={classes.chooseDatesHolder}>
			{isLoading && <CircularProgress />}
			{spaceAvailability.length > 0 &&
				(type === 'start' ? getAvailableByDate(date) : filterFromStartTime()).map((item: SpaceAvailabilityItem, index: number) => (
					<Button
						variant="outlined"
						key={index}
						disabled={type === 'start' ? item.isMinTime || item.reserved : item.disabled || isReserved(item) || isStartTime(item)}
						onClick={() => handleSelectTime(item.value)}
						className={selectedTime && dateWithTz(item.value, tzId).isSame(selectedTime) ? classes.timeBtnActive : classes.timeBtn}
					>
						{type === 'end' && isStartTime(item) && <small className={classes.timeBadge}>start time</small>}
						{isReserved(item) && <small className={classes.timeBadge}>Reserved</small>}
						{type === 'start' && item.isMinTime && <small className={classes.timeBadge}>min time</small>}
						{dateWithTz(item.value, tzId).format(timeFormat)}
					</Button>
				))}
		</div>
	);
}
