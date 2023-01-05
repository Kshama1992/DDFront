import React, { forwardRef, useContext, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import Button from '@mui/material/Button';
import SelectReservationTimeComponent from '@forms/elements/select-reservation-time.component';
import { AuthContext } from '@context/auth.context';
import DialogStyles from './style/dialog.style';

interface DialogEndTimeComponentProps {
	onNext: (startTime: Dayjs | undefined, endTime: Dayjs | undefined) => any;
	onPrev: () => any;
	onClose: () => any;
	initialStartDate?: Dayjs | undefined;
	open: boolean;
	space: SpaceInterface;
	tzId: string;
}

const Transition = forwardRef((props: TransitionProps & { children: React.ReactElement<any, any> }, ref: React.Ref<unknown>) => (
	<Slide direction="up" ref={ref} {...props} />
));

export default function DialogEndTimeComponent({ open, initialStartDate, onPrev, space, onClose, onNext, tzId }: DialogEndTimeComponentProps) {
	const classes = DialogStyles();
	const { authBody } = useContext(AuthContext);
	const [startTime, setStartTime] = useState<Dayjs | undefined>();
	const [endTime, setEndTime] = useState<Dayjs | undefined>();
	const [errorMsg, setErrorMsg] = useState<string | undefined>();

	useEffect(() => {
		if (!startTime || (initialStartDate && startTime.toString() !== initialStartDate.toString())) setStartTime(initialStartDate);
	}, [initialStartDate]);

	const handleDone = () => {
		onNext(startTime, endTime);
	};

	const onTimeSelected = (value: string) => {
		setEndTime(dayjs(value));

		const givenRoundHours = dayjs(value).diff(startTime, 'hour', true);
		setErrorMsg(givenRoundHours < space.roundHours ? `Minimum booking slot for this package is ${space.roundHours} Hours` : undefined);
	};

	return (
		<Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
			<div className={classes.backgroundLayer}>
				<Paper onClick={onPrev} className={classes.backButton}>
					<ChevronLeftIcon />
				</Paper>
				<div>
					<Typography className={classes.chooseDateTitle}>
						<QueryBuilderIcon />
						Choose an End time
					</Typography>
				</div>

				<Paper className={classes.chooseDateForm}>
					<SelectReservationTimeComponent
						type="end"
						startTime={startTime}
						space={space}
						tzId={tzId}
						date={dayjs(initialStartDate).format('YYYY-MM-DD')}
						onTimeSelected={onTimeSelected}
						userId={authBody?.id}
					/>
					<div className={classes.buttonsWeekly}>
						<Button className={classes.prevWeekButton} onClick={onPrev}>
							<ChevronLeftIcon />
							Change time
						</Button>
					</div>

					<Typography className={classes.chooseStartTimeDate}>
						<DateRangeIcon />
						{startTime && startTime.format('MMMM, D, YYYY  HH:mm:ss')}
					</Typography>

					{errorMsg && <Typography className={classes.errorMsg}>{errorMsg}</Typography>}

					<div>
						<Button
							className={classes.buttonSubmit}
							disabled={!endTime || !!errorMsg}
							color="primary"
							variant="contained"
							onClick={handleDone}
						>
							Submit & Continue
						</Button>
					</div>
				</Paper>
			</div>
		</Dialog>
	);
}
