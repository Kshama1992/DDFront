import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { common } from '@mui/material/colors';

const FormBrandStyles = makeStyles((theme: Theme) =>
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
		uploadInput: {
			display: 'none',
		},
		uploadLogoWrap: {
			display: 'flex',
			justifyContent: 'flex-start',
			flexDirection: 'column',
			alignItems: 'center',
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
			width: '100%',
			height: 300,
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
		container: {
			padding: 35,
		},
		topTitle: {
			boxShadow: '0px 2px 2px 0px grey',
			'& .MuiTab-root': {
				padding: 20,
				minWidth: 130,
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
		avaLbl: {
			display: 'block',
			height: 300,
			[theme.breakpoints.down('md')]: {
				height: 'auto',
			},
		},
		unlayerEditorWrap: {
			'& > div': {
				width: '100% !important',
				display: 'flex !important',
				flex: '1 !important',
			},
			'& iframe': {
				flex: 1,
				width: '100% !important',
				height: '100% !important',
				minWidth: 'auto !important',
				display: 'flex !important',
				border: 0,
			},
		},
	})
);
export default FormBrandStyles;
