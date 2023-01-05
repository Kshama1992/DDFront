import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { common } from '@mui/material/colors';

const FormVenueStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			marginBottom: 25,
			'& .MuiFormLabel-root, & .MuiFormControlLabel-label': {
				textTransform: 'uppercase',
				fontSize: 12,
				fontWeight: 500,
				color: theme.palette.text.primary,
			},
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
			'& .MuiFormHelperText-root': {
				fontSize: 12,
				margin: 0,
				marginTop: 5,
			},
		},
		hiddenField: {
			width: 0,
			height: 0,
			opacity: 0,
		},

		formControl: {
			width: '100%',
		},
		container: {
			padding: 35,
		},
		topTitle: {
			boxShadow: '0px 2px 2px 0px grey',
			'& .MuiTab-root': {
				padding: '30px',
			},
		},
		backContainer: {
			padding: 20,
			backgroundColor: theme.palette.grey.A100,
			boxSizing: 'border-box',
		},
		avatar: {
			border: '1px solid gray',
			color: theme.palette.primary.main,
			backgroundColor: common.white,
			width: 90,
			height: 90,
			cursor: 'pointer',
			'& p': {
				fontSize: 12,
			},
			'& .MuiIconButton-label': {
				flexDirection: 'column',
			},
			fallback: {
				backgroundImage: 'src(/images/logo-small.png)',
			},
		},
		avatarSquare: {
			border: '1px solid gray',
			color: theme.palette.primary.main,
			backgroundColor: common.white,
			width: 85,
			height: 85,
			borderRadius: 0,
			marginRight: 30,
			cursor: 'pointer',
			boxSizing: 'border-box',
			position: 'relative',
			'& .MuiAvatar-root': {
				width: '100%',
				height: '100%',
			},
			'& p': {
				fontSize: 12,
			},
			'& .MuiIconButton-label': {
				flexDirection: 'column',
			},
		},

		backIcon: {},
		backLink: {},
		tabTitleWrapper: {
			borderBottom: `1px solid ${theme.palette.grey.A100}`,
			borderTop: `1px solid ${theme.palette.grey.A100}`,
			padding: 15,
			fontSize: 15,
			fontWeight: 500,
			justifyContent: 'space-between',
			display: 'flex',
		},
		amenityBtn: {
			textTransform: 'none',
		},
		amenityIcon: {
			// marginRight: 15, marginBottom: -5,
			color: theme.palette.primary.main,
		},
		dialogTitle: {
			color: theme.palette.primary.main,
			fontWeight: 400,
			textAlign: 'center',
		},
		timeLine: {},
		timeWrapper: {
			paddingTop: 15,
			paddingBottom: 15,
		},
		timeLabel: {
			paddingLeft: 50,
		},
		timeName: {
			paddingLeft: 40,
			paddingTop: 15,
			[theme.breakpoints.down('md')]: {
				display: 'inline-block',
				textAlign: 'center',
				width: '100%',
				padding: 0,
			},
		},
		timeDivider: {
			marginTop: 15,
			marginBottom: -15,
		},
		uploadInput: {
			display: 'none',
		},
		uploadLogoWrap: {
			display: 'flex',
			justifyContent: 'flex-start',
			flexDirection: 'column',
			alignItems: 'center',
		},
		photosWrap: {
			display: 'flex',
		},
		photosClose: {
			position: 'absolute',
			top: -15,
			right: -15,
			backgroundColor: 'white',
			borderRadius: '50%',
			padding: 0,
		},
		bottomWrap: {
			display: 'flex',
			justifyContent: 'flex-end',
			paddingRight: 35,
			paddingBottom: 15,
			[theme.breakpoints.down('md')]: {
				overflow: 'hidden',
				display: 'block',
				padding: 0,
				'& button': {
					minWidth: '100%',
					borderRadius: 0,
					padding: '20px 20px',
				},
			},
		},
		errorText: {
			textAlign: 'center',
			margin: '15px 0',
			color: 'red',
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
		phoneInput: {
			width: '100%',
			'& .react-tel-input .form-control+div:before': {
				top: -13,
				textTransform: 'uppercase',
				fontSize: 10,
				left: -5,
				fontWeight: 500,
				color: 'red',
			},
			'& .MuiInputBase-root': {
				margin: 0,
			},
			'& .form-control.form-control': {
				width: '100%',
				padding: '19px 14px 19px 58px',
				borderColor: 'red',
			},
		},

		phoneInputError: {
			width: '100%',
			'& input:disabled + div .flag': {
				opacity: 0.5,
			},
			'& input:disabled': {
				color: '#adadad',
			},
			'& .react-tel-input .form-control+div:before': {
				top: -13,
				textTransform: 'uppercase',
				fontSize: 10,
				left: -5,
				fontWeight: 500,
			},
			'& .MuiInputBase-root': {
				margin: 0,
			},
			'& .form-control.form-control': {
				width: '100%',
				padding: '20px 14px 20px 58px',
			},
		},

		imageErrorText: {
			width: '100%',
		},
	})
);

export default FormVenueStyles;
