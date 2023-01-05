import React, { forwardRef } from 'react';
import Typography from '@mui/material/Typography';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import SelectDateComponent from '@forms/elements/select-date.component';
import DialogStyles from './style/dialog.style';

interface DialogDateComponentProps {
	onClose: () => any;
	onSelect: (date: string) => any;
	open: boolean;
	space: SpaceInterface;
	actionBtn?: () => any;
}
const Transition = forwardRef((props: TransitionProps & { children: React.ReactElement<any, any> }, ref: React.Ref<unknown>) => (
	<Slide direction="up" ref={ref} {...props} />
));

export default function DialogDateComponent({ open, onClose, space, onSelect, actionBtn }: DialogDateComponentProps) {
	const classes = DialogStyles();

	return (
		<Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
			<div className={classes.backgroundLayer}>
				<Paper onClick={onClose} className={classes.backButton}>
					<ChevronLeftIcon />
				</Paper>
				<div>
					<Typography className={classes.chooseDateTitle}>
						<DateRangeIcon />
						Choose a Date
					</Typography>
				</div>
				<SelectDateComponent tzId={space.venue.tzId} actionBtn={actionBtn} space={space} onDateSelected={onSelect} />
			</div>
		</Dialog>
	);
}
