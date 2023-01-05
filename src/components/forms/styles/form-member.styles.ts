import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { common } from '@mui/material/colors';

const FormMemberStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiFormLabel-root, & .MuiFormControlLabel-label': {
				textTransform: 'uppercase',
				fontSize: 12,
				fontWeight: 500,
				color: theme.palette.text.primary,
			},
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
		},
		formControl: {
			width: '100%',
		},
		container: {
			padding: 35,
		},
		subContainer: {
			padding: 35,
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
		topTitle: {
			boxShadow: '0px 2px 2px 0px grey',
			'& .MuiTab-root': {
				padding: '20px',
				minWidth: 130,
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
		backContainer: {
			padding: 20,
			backgroundColor: theme.palette.grey.A100,
			boxSizing: 'border-box',
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
		bottomWrap: {
			display: 'flex',
			justifyContent: 'flex-end',
			paddingRight: 35,
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
		uploadInput: {
			display: 'none',
		},
		uploadLogoWrap: {
			display: 'flex',
			justifyContent: 'center',
		},
		title: {
			textTransform: 'uppercase',
			marginBottom: 5,
			fontSize: 13,
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
		errorText: {
			textAlign: 'center',
			margin: '15px 0',
			color: 'red',
		},
		switch: {
			marginLeft: 15,
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
		switchLabel: {
			marginLeft: 0,
			fontSize: 12,
		},
		timeField: {
			maxWidth: 125,
			fontSize: 11,
			marginTop: -3,
			'& input': {
				padding: '12px 10px',
				fontSize: 11,
			},
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
		imageErrorText: {
			width: '100%',
		},
		timeWrapper: {
			paddingTop: 15,
			paddingBottom: 15,
		},
		avatar: {
			width: theme.spacing(13),
			height: theme.spacing(13),
		},
		middleSpacer: {
			margin: '30px 0',
			width: '100%',
		},
		fieldTitle: {
			fontWeight: 600,
			textTransform: 'uppercase',
			fontSize: 15,
			marginTop: 25,
		},
		myCompanyEdit: {
			marginLeft: 15,
			marginBottom: 2,
		},
		fieldValue: {
			fontSize: 15,
		},
		memberActionLeft: {
			position: 'absolute',
			bottom: 30,
			left: 20,
		},
		memberActionRight: {
			position: 'absolute',
			bottom: 30,
			right: 20,
		},
		memberWrapper: {
			textAlign: 'center',
			marginTop: 15,
			marginBottom: 15,
			position: 'relative',
		},
		memberAvatar: {
			width: 120,
			height: 120,
			margin: '0 auto',
			marginBottom: 10,
		},
		memberLink: {
			display: 'inline-block',
			textDecoration: 'none',
			color: theme.palette.primary.main,
			fontWeight: 400,
			width: '100%',
		},
		text: {
			padding: 10,
			textAlign: 'center',
		},
		btnText: {
			textTransform: 'none',
			marginTop: 15,
			marginRight: 15,
			color: '#333',
		},
		moveOutIcon: {
			color: theme.palette.primary.main,
		},
		suspendIcon: {
			color: theme.palette.grey.A200,
		},
		deleteIcon: {
			color: theme.palette.secondary.main,
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
				padding: '20px 14px 20px 58px',
				borderColor: 'red',
			},
		},
		tableCell: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '15px 0',
			},
		},
		tableRow: {
			[theme.breakpoints.down('md')]: {
				borderBottom: '1px solid #333',
			},
		},
		phoneInputError: {
			width: '100%',
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
	})
);

export default FormMemberStyles;
