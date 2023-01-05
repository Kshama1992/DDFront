import React, { useState, useCallback, useContext, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import SpaceAvailability from 'dd-common-blocks/dist/interface/space-availability.interface';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '@context/auth.context';
import SpaceService from '@service/space.service';

const useClasses = makeStyles((theme: Theme) =>
	createStyles({
		chooseDateForm: {
			width: '100%',
			maxWidth: 600,
			margin: '0 auto',
			padding: 30,
			boxSizing: 'border-box',
			minHeight: 350,
			// marginBottom: 35,
		},
		chooseDateTop: {
			borderBottom: '3px solid #2f96e6',
			marginBottom: 30,
		},
		chooseDateMonth: {
			fontWeight: 600,
			fontSize: 20,
			textTransform: 'uppercase',
			padding: '0 0 15px 0',
		},
		chooseDatesHolder: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			flexWrap: 'wrap',
		},
		dateBtn: {
			borderRadius: 3,
			color: theme.palette.primary.main,
			fontSize: 40,
			display: 'inline-block',
			padding: '16px 9px 6px 9px',
			width: 72,
			'& small': {
				display: 'inline-block',
				width: '100%',
				fontSize: 14,
			},
			[theme.breakpoints.down('md')]: {
				marginBottom: 10,
				width: '32%',
			},
		},
		dateBtnActive: {
			borderRadius: 3,
			background: theme.palette.primary.main,
			color: '#fff',
			fontSize: 40,
			width: 72,
			display: 'inline-block',
			padding: '16px 9px 6px 9px',
			'& small': {
				display: 'inline-block',
				width: '100%',
				fontSize: 14,
			},
			[theme.breakpoints.down('md')]: {
				marginBottom: 10,
				width: '32%',
				'&:hover': {
					background: theme.palette.primary.main,
				},
			},
		},
		badge: {
			position: 'absolute',
			top: -15,
			right: -1,
			background: '#e0e0e0',
			color: '#fff',
			width: 'calc(100% + 2px) !important',
		},
		buttonsWeekly: {
			display: 'flex',
			justifyContent: 'space-between',
			paddingTop: 30,
		},
		prevWeekButton: {
			textTransform: 'none',
			borderRadius: 0,
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
			},
		},
		nextWeekButton: {
			textTransform: 'none',
			borderRadius: 0,
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
			},
		},
	})
);

interface SelectDateInputProps {
	onWeekChange?: () => any;
	onDateSelected: (date: string) => any;
	space: SpaceInterface | undefined;
	actionBtn?: (isLoading: boolean) => any;
	userId?: string | number;
	tzId: string;
	selectedDate?: string;
}

export default function SelectDateComponent({
	selectedDate = dayjs().format('YYYY-MM-DD'),
	onWeekChange,
	space,
	onDateSelected,
	actionBtn,
	userId,
	tzId,
}: SelectDateInputProps) {
	const classes = useClasses();
	const spaceService = new SpaceService();

	const { authBody } = useContext(AuthContext);

	const [availabilityDates, setAvailabilityDates] = useState<{ startDate: string; endDate: string }>({
		startDate: dayjs().format('YYYY-MM-DD'),
		endDate: dayjs().add(6, 'd').format('YYYY-MM-DD'),
	});
	const [spaceAvailability, setSpaceAvailability] = useState<SpaceAvailability[]>([]);
	const [startDateSrt, setStartDateSrt] = useState<string | undefined>(dayjs(selectedDate).tz(tzId).format('YYYY-MM-DD'));
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const loadAvailability = useCallback(async () => {
		if (!authBody || !space) return;
		try {
			const availability = await spaceService.availability(space.id!, {
				userId: userId || authBody.id!,
				...availabilityDates,
				userTZ: tzId,
			});

			const openDates = availability
				.sort((a: SpaceAvailability, b: SpaceAvailability) => (new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1))
				.filter((a: SpaceAvailability) => a.open && !a.reserved && dayjs(a.date, 'YYYY-MM-DD').isSameOrAfter(dayjs()));
			// set first available date
			if (openDates.length && !startDateSrt) setStartDateSrt(dayjs(openDates[0].date, 'YYYY-MM-DD').format('YYYY-MM-DD'));

			setSpaceAvailability(availability);
			setIsLoading(false);
		} catch (e) {
			console.error(e);
		}
	}, [availabilityDates, tzId]);

	useEffect(() => {
		loadAvailability().then();
	}, [availabilityDates, tzId]);

	const isYesterday = (date: string): boolean => dayjs(date).subtract(1, 'day').isBefore(dayjs());

	const handleNextWeek = async () => {
		setAvailabilityDates({
			startDate: availabilityDates.endDate,
			endDate: dayjs(availabilityDates.endDate).add(7, 'day').format('YYYY-MM-DD'),
		});
		if (onWeekChange) onWeekChange();
	};

	const handlePrevWeek = async () => {
		setAvailabilityDates({
			startDate: dayjs(availabilityDates.startDate).subtract(7, 'day').format('YYYY-MM-DD'),
			endDate: availabilityDates.startDate,
		});
		if (onWeekChange) onWeekChange();
	};

	const handleSelectDate = (date: string) => {
		const spaceAvailabilityDate = spaceAvailability.find((sa) => sa.date === date);
		if (spaceAvailabilityDate) {
			setStartDateSrt(date);
			if (onDateSelected) onDateSelected(date);
		}
	};

	return (
		<Paper className={classes.chooseDateForm}>
			<div className={classes.chooseDateTop}>
				<Typography className={classes.chooseDateMonth}>
					{spaceAvailability && spaceAvailability.length > 0
						? dayjs(spaceAvailability[0].date).format('MMMM YYYY')
						: dayjs().format('MMMM YYYY')}
				</Typography>
			</div>
			<div className={classes.chooseDatesHolder}>
				{isLoading && <CircularProgress />}

				{spaceAvailability.length > 0 &&
					spaceAvailability.map((item, index) => (
						<Button
							variant="outlined"
							key={index}
							onClick={() => handleSelectDate(item.date)}
							disabled={(!item.open || item.reserved) && (dayjs(item.date).isBefore(dayjs().startOf('day')) || item.items.length === 0)}
							className={startDateSrt && startDateSrt === item.date ? classes.dateBtnActive : classes.dateBtn}
						>
							<span>{dayjs(item.date).format('D')}</span>
							<small>{dayjs(item.date).format('ddd')}</small>
							{item.open && item.reserved && <small className={classes.badge}>reserved</small>}
							{!item.open && <small className={classes.badge}>closed</small>}
						</Button>
					))}
			</div>
			<div className={classes.buttonsWeekly}>
				<Button className={classes.prevWeekButton} onClick={handlePrevWeek} disabled={isYesterday(availabilityDates.startDate)}>
					<ChevronLeftIcon />
					Previous Week
				</Button>
				<Button className={classes.nextWeekButton} onClick={handleNextWeek}>
					Next Week
					<ChevronRightIcon />
				</Button>
			</div>

			{actionBtn && actionBtn(isLoading)}
		</Paper>
	);
}
