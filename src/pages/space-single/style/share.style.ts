import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const ShareStyle = makeStyles((theme: Theme) =>
	createStyles({
		spaceShare: {
			display: 'flex !important',
			height: '100%',
			alignItems: 'center',
			width: '50%',
			'& .MuiPaper-root': {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-around',
			},
			'& > span': {
				marginRight: 15,
				color: theme.palette.primary.main,
			},

			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
			},
			'& > a:-webkit-any-link': {
				color: theme.palette.primary.main,
				textDecoration: 'none',
				marginRight: '15px',
			},
			[theme.breakpoints.only('xl')]: {
				width: '40%',
			},
		},
		shareBtn: {
			border: '1px solid #ccc',
			padding: '8px 0',
			borderRadius: 5,
			width: 80,
			textAlign: 'center',
			fontSize: 12,
			textTransform: 'none',
			display: 'flex',
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
				fontSize: 18,
				marginRight: 10,
				marginBottom: -2,
			},
			[theme.breakpoints.down('md')]: {
				paddingTop: 0,
				paddingBottom: 0,
				height: 38,
				marginTop: 10,
				marginLeft: 20,
			},
		},
		spaceShareMobileText: {
			height: '100%',
			width: '30%',
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			'& p': {
				fontSize: 13,
			},
		},
		spaceShareMobileTextIcon: {
			height: '100%',
			width: 45,
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			margin: '10px auto',
		},
	})
);

export default ShareStyle;
