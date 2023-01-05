import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const TeamListComponentStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: '100%',
			'& .MuiInput-input': {
				border: 'none',
			},
		},
		calendarIcon: {
			color: theme.palette.primary.main,
			marginBottom: -5,
			marginRight: 5,
		},
		sendIconBtn: {},
		sendIcon: {},
		avatar: {
			width: 80,
			height: 80,
		},
		textSecondary: {
			fontSize: 13,
			color: theme.palette.grey.A700,
			width: '100%',
			display: 'inline-block',
		},
		textSecondaryLink: {
			fontSize: 13,
			color: theme.palette.primary.main,
			width: '100%',
			paddingLeft: 5,
			textDecoration: 'none',
		},
		textCreatedBy: {
			fontSize: 13,
			color: theme.palette.primary.main,
			width: '100%',
			display: 'inline-block',
			textDecoration: 'none',
		},
		textPrimary: {
			fontSize: 15,
			paddingTop: 5,
			textDecoration: 'none',
		},
		textPrimaryLaptop: {
			fontSize: 15,
			textDecoration: 'none',
		},
		locationIcon: {
			color: theme.palette.primary.main,
			fontSize: 13,
			marginRight: 5,
			marginBottom: -2,
		},
		gotoBtn: {
			textDecoration: 'none',
			color: '#333',
			'&:hover': {
				color: theme.palette.primary.main,
			},
		},
		gotoBtnIcon: {
			color: theme.palette.primary.main,
			marginBottom: '-8px',
		},
		searchField: {
			border: 'none',
		},
		membersCountWrapper: {
			color: theme.palette.primary.main,
			fontSize: 15,
		},
		membersCountIcon: {
			marginBottom: -5,
			fontSize: 20,
			marginRight: 5,
		},
		searchIcon: {
			color: theme.palette.primary.main,
		},
		loaderWrapper: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(255,255,255,0.31)',
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		noItemsText: {
			width: '100%',
			textAlign: 'center',
			padding: 15,
			boxSizing: 'border-box',
		},
		tableContainer: {
			height: 'calc(100vh - 261px)',
		},
		tableHeaderCell: {
			[theme.breakpoints.only('lg')]: {
				'& > p': {
					fontSize: 12,
				},
			},
		},
		tableCell: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '5px 0',
				overflow: 'hidden',
				fontWeight: 500,
			},
		},
		tableRow: {
			[theme.breakpoints.down('md')]: {
				borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
				display: 'inline-block',
				paddingBottom: 15,
				width: '100%',
			},
		},
		tableHead: {
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
		mobileText: {
			display: 'none',
			color: '#333',
			fontWeight: 500,
			[theme.breakpoints.down('md')]: {
				display: 'block',
			},
		},
	})
);

export default TeamListComponentStyles;
