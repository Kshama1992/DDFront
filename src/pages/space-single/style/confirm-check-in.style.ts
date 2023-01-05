import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

const ConfirmCheckInStyle = makeStyles((theme: Theme) =>
	createStyles({
		backButton: {
			height: 40,
			width: 40,
			textAlign: 'center',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			borderRadius: '50%',
			zIndex: 100,
			top: '0',
			right: '0',
			cursor: 'pointer',
			color: '#000',
		},
		heading: {
			textTransform: 'none',
			fontWeight: 400,
			margin: '20px 0 0',
			fontSize: 30,
			padding: '10px 20px',
			textAlign: 'center',
			'& span': {
				color: theme.palette.primary.main,
			},
		},
		text: {
			fontSize: 12,
			textAlign: 'center',
			padding: '10px 20px',
			'& span': {
				color: theme.palette.primary.main,
			},
		},
		btnWrp: {
			textAlign: 'center',
			marginBottom: 40,
			marginTop: 30,
		},
		btn: {
			borderRadius: '5px',
			padding: '20px 25px',
			fontWeight: 500,
		},
		btnBlack: {
			borderRadius: '5px',
			padding: '20px 25px',
			fontWeight: 500,
			backgroundColor: '#333',
			color: '#fff',
		},
		priceBold: {
			fontWeight: 'bold',
		},
	})
);

export default ConfirmCheckInStyle;
