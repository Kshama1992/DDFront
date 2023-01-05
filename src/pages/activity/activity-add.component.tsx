import React from 'react';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormActivityComponent from '@forms/form-activity.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {
			padding: 15,
			color: theme.palette.primary.main,
			textAlign: 'center',
			fontWeight: 300,
			position: 'relative',
			fontSize: 25,
		},
		closeBtn: {
			position: 'absolute',
			top: -10,
			right: -15,
		},
	})
);

export default function ActivityAddComponent({ open, onClose }: { open: boolean; onClose?: () => void }) {
	const classes = useStyles({});

	const handleClose = () => {
		if (typeof onClose !== 'undefined') {
			onClose();
		}
	};

	return (
		<Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
			<DialogContent>
				<DialogContentText className={classes.title}>
					Add an Activity
					<IconButton aria-label="close" className={classes.closeBtn} onClick={handleClose} size="large">
						<CloseIcon />
					</IconButton>
				</DialogContentText>

				<FormActivityComponent onSave={handleClose} />
			</DialogContent>
		</Dialog>
	);
}
