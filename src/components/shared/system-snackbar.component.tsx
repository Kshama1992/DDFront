import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import createStyles from '@mui/styles/createStyles';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import { SnackBarContext } from '@context/snack-bar.context';

const useStyles = makeStyles((theme) =>
	createStyles({
		info: {
			color: '#fff',
			backgroundColor: '#000',
			'& .MuiPaper-root': {
				backgroundColor: 'transparent',
			},
			'& .MuiIconButton-root': {
				color: '#fff',
			},
			'& .MuiTypography-root': {
				color: '#fff',
			},
		},
		error: {
			backgroundColor: '#fff',

			'& .MuiPaper-root': {
				backgroundColor: 'transparent',
			},
			'& .MuiTypography-root': {
				color: red.A400,
			},
			'& .MuiIconButton-root': {
				color: theme.palette.primary.main,
			},
			'& .MuiButton-root': {
				textDecoration: 'underline',
				color: theme.palette.primary.main,
			},
		},
		warning: {
			backgroundColor: '#333',
			'& .MuiPaper-root': {
				backgroundColor: 'transparent',
			},
			'& .MuiIconButton-root': {
				color: '#fff',
			},
		},
	})
);
export default function SystemSnackbarComponent() {
	const classes = useStyles({});

	const { snackBarState, hideSnackBar } = useContext(SnackBarContext);

	let className = classes.info;
	if (snackBarState.state === 'error') className = classes.error;
	if (snackBarState.state === 'warning') className = classes.warning;

	const closeBtn = () => (
		<IconButton key="close" aria-label="close" color="primary" onClick={() => hideSnackBar()} size="large">
			<CloseIcon />
		</IconButton>
	);

	const linkBtn = () => {
		if (!snackBarState.link) return <></>;
		return (
			<Button key={0} component={Link} to={snackBarState.link} color="secondary">
				{snackBarState.linkText ? snackBarState.linkText : snackBarState.link}
			</Button>
		);
	};
	return (
		<Snackbar
			className={className}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			open={snackBarState.visible}
			autoHideDuration={3500}
			onClose={() => hideSnackBar()}
			message={<Typography>{snackBarState.message}</Typography>}
			action={snackBarState.link ? [linkBtn()] : [closeBtn()]}
		/>
	);
}
