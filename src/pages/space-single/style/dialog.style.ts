import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

export default makeStyles((theme: Theme) =>
	createStyles({
		backgroundLayer: {
			position: 'absolute',
			background: 'url(/images/signBg.png) no-repeat center/cover',
			width: '100%',
			height: 250,
			backgroundPosition: 'top',
			textAlign: 'center',
		},

		chooseStartTimeDate: {
			fontWeight: 400,
			marginTop: -35,
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
				marginBottom: -5,
				marginRight: 10,
			},
			[theme.breakpoints.down('md')]: {
				margin: '0 auto',
			},
		},
		errorMsg: {
			fontWeight: 400,
			marginTop: -35,
			color: 'red',
			display: 'inline-block',
		},
		chooseDateTitle: {
			color: '#fff',
			textTransform: 'none',
			fontWeight: 400,
			margin: '30px 0 30px',
			fontSize: 30,
			'& .MuiSvgIcon-root': {
				marginRight: 10,
				marginBottom: -3,
			},
		},
		chooseDateTitleIcon: {
			width: 25,
			margin: '10px 10px 0',
		},
		chooseDateForm: {
			width: '100%',
			maxWidth: 600,
			margin: '0 auto',
			padding: 30,
			boxSizing: 'border-box',
			minHeight: 350,
			marginBottom: 35,
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
		buttonAngleWeekly: {
			color: '#3698e3',
			margin: 5,
		},
		buttonAngleSubmit: {
			color: '#fff',
			marginLeft: 10,
		},
		buttonSubmit: {
			// background: '#3698e3',
			// color: '#fff',
			borderRadius: '4px',
			marginTop: 20,
			fontSize: 16,
			padding: '16px 40px',
			textTransform: 'none',
			// '&:hover': {
			// 	background: '#3698e3',
			// },
			[theme.breakpoints.down('md')]: {
				padding: '16px 20px',
				width: '100%',
			},
		},
		backButton: {
			height: 40,
			width: 40,
			margin: 20,
			textAlign: 'center',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			borderRadius: '50%',
			zIndex: 100,
			top: '0%',
			left: '0%',
			cursor: 'pointer',
			color: '#000',
			[theme.breakpoints.only('sm')]: {
				marginTop: 45,
			},
		},
		radiGroup: {
			flexDirection: 'row',
		},
		checkoutPhoto: {
			width: '100%',
		},
		checkoutDetails: {
			width: '45%',
			paddingRight: 30,
			paddingTop: 20,
			[theme.breakpoints.down('md')]: {
				width: '100%',
			},
		},
		checkoutDetailsTitle: {
			fontSize: 20,
			borderBottom: '3px solid #3698e3',
			textAlign: 'left',
			marginBottom: 0,
		},
		checkoutDetailItem: {
			borderBottom: '1px solid #d2d2d2',
			marginBottom: 0,
			textAlign: 'left',
			padding: '12px 0 0',
			fontSize: 16,
		},
		checkoutDetailName: {
			marginBottom: 0,
			textAlign: 'left',
			paddingLeft: '0 !important',
			width: '60%',
			fontWeight: 400,
			'& h3': {
				fontWeight: 400,
				fontSize: 18,
			},
		},
		checkoutPrice: {
			background: '#f3f3f3',
			borderRadius: 4,
			marginTop: 30,
			width: '50%',
			padding: '10px 30px 30px',
			height: '100%',
			boxSizing: 'border-box',
			[theme.breakpoints.down('md')]: {
				width: '100%',
			},
		},
		checkoutSpaceName: {
			borderBottom: '1px solid  #d2d2d2',
			textAlign: 'left',
			fontSize: 20,
			position: 'relative',
			padding: '20px 0px',
			textTransform: 'none',
			marginBottom: 0,
		},

		checkoutPriceItem: {
			marginBottom: 0,
			textAlign: 'left',
			padding: '12px 0 0',
			fontSize: 14,
		},
		checkoutPriceName: {
			marginBottom: 0,
			textAlign: 'left',
			paddingLeft: '0 !important',
			width: '60%',
			fontWeight: 400,
			'& h3': {
				fontWeight: 400,
				marginBottom: 0,
				fontSize: 18,
			},
		},
		checkoutPriceValue: {
			textAlign: 'right',
			width: '40%',
			paddingLeft: 20,
			'& span': {
				fontWeight: 500,
			},
			'& h3': {
				fontWeight: 500,
				marginBottom: 0,
				fontSize: 18,
			},
		},
		checkoutPriceAmount: {
			borderTop: '1px solid #ccc',
			paddingTop: 15,
			marginTop: 20,
		},
		checkoutPriceSum: {
			'& h3': {
				fontWeight: 600,
			},
		},
		checkoutSpaceLocation: {
			fontWeight: 400,
		},
		checkoutSpacePrice: {
			color: '#3698e3',
			position: 'absolute',
			right: 0,
			fontSize: 26,
			fontWeight: 500,
			top: '50%',
			marginTop: '-20px',
			[theme.breakpoints.down('md')]: {
				display: 'inline-block',
				width: '100%',
				position: 'relative',
				textAlign: 'center',
			},
		},
		checkoutDescription: {
			display: 'flex',
			flexDirection: 'row',
			[theme.breakpoints.down('md')]: {
				flexDirection: 'column',
			},
		},
	})
);
