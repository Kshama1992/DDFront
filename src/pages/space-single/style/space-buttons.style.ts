import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const SpaceButtonsStyle = makeStyles((theme: Theme) =>
	createStyles({
		checkInBtn: {
			bottom: '30% !important',
			[theme.breakpoints.down('md')]: {
				bottom: '10% !important',
			},
		},
		buttonProgress: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			color: '#fff',
			marginTop: -12,
			marginLeft: -12,
		},
		buttonSubmit: {
			borderRadius: '4px',
			marginTop: 20,
			fontSize: 16,
			padding: '16px 40px',
			textTransform: 'none',
			[theme.breakpoints.down('md')]: {
				padding: '16px 20px',
				width: '100%',
			},
		},
		spaceBookSpace: {
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			margin: '10px auto',
			'& > button, & > a': {
				padding: '20px 25px',
				background: '#f3a42a !important',
				textTransform: 'uppercase',
				borderRadius: 5,
				cursor: 'pointer',
				opacity: 1,
				color: '#fff',
				fontWeight: 500,
				textDecoration: 'none',
				'&:hover': {
					background: '#fff !important',
					color: '#f3a42a !important',
				},
			},
			[theme.breakpoints.down('md')]: {
				position: 'fixed',
				bottom: 0,
				left: 0,
				width: '100vw',
				borderRadius: 0,
				textAlign: 'center',
				boxSizing: 'border-box',
				margin: '0 auto',
				marginLeft: '0',
				'& > button, & > a': {
					width: '100%',
					background: theme.palette.primary.main,
					'&:hover': {
						background: '#fff',
						color: theme.palette.primary.main,
					},
				},
			},
		},
	})
);

export default SpaceButtonsStyle;
