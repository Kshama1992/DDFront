import React, { forwardRef, useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import Button from '@mui/material/Button';
import SelectReservationTimeComponent from '@forms/elements/select-reservation-time.component';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import DialogStyles from './style/dialog.style';

interface DialogStartTimeComponentProps {
	onNext: (startTime: Dayjs) => any;
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

export default function DialogStartTimeComponent({ open, initialStartDate, onPrev, space, onClose, onNext, tzId }: DialogStartTimeComponentProps) {
	const classes = DialogStyles();
	const { authBody } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const [startTime, setStartTime] = useState<Dayjs | undefined>(initialStartDate);

	const handleDone = () => {
		if (!startTime) showSnackBar('Please select start time.');
		else onNext(startTime);
	};

	const onTimeSelected = (value: string) => {
		setStartTime(dayjs(value));
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
						Choose a Start time
					</Typography>
				</div>
				<Paper className={classes.chooseDateForm}>
					<SelectReservationTimeComponent
						space={space}
						tzId={tzId}
						date={dayjs(initialStartDate).format('YYYY-MM-DD')}
						onTimeSelected={onTimeSelected}
						userId={authBody?.id}
					/>

					<div className={classes.buttonsWeekly}>
						<Button className={classes.prevWeekButton} onClick={onPrev}>
							<ChevronLeftIcon />
							Change date
						</Button>
					</div>

					<Typography className={classes.chooseStartTimeDate}>
						<DateRangeIcon />
						{initialStartDate && dayjs(initialStartDate).format('MMMM, D, YYYY')}
					</Typography>

					<div>
						<Button className={classes.buttonSubmit} disabled={!startTime} color="primary" variant="contained" onClick={handleDone}>
							{'Confirm & Choose End Time'}
							<ChevronRightIcon />
						</Button>
					</div>
				</Paper>
			</div>
		</Dialog>
	);
}
