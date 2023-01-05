import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const activityRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: '100%',
			'& .MuiInput-input': {
				border: 'none',
			},
		},
		avatar: {
			[theme.breakpoints.down('md')]: {
				// display: 'none',
				width: '100%',
				height: 150,
				marginBottom: -80,
				marginTop: -5,
				borderRadius: 0,
			},
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
		spaceNameWrap: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				zIndex: 1,
				position: 'relative',
				backgroundColor: 'rgba(255, 255, 255, 0.8)',
				padding: '0 !important',
				paddingBottom: '10px !important',
				marginBottom: 5,
				'& > a': {
					display: 'inline-block',
					width: '100%',
				},
				'& p, & span': {
					color: '#333',
					display: 'inline',
				},
			},
		},
		spaceName: {
			fontSize: 15,
			paddingTop: 5,
			fontWeight: 400,
			textDecoration: 'none',
		},
		spaceNameLaptop: {
			fontSize: 15,
			textDecoration: 'none',
			fontWeight: 400,
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
			'& p, & span': { fontSize: 14 },
		},
		priceCell: {
			[theme.breakpoints.down('md')]: {
				width: '30%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '5px 0',
				overflow: 'hidden',
				fontWeight: 500,
			},
		},
		actionCell: {
			[theme.breakpoints.down('md')]: {
				width: '16%',
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
				'& .MuiListItem-gutters': {
					paddingTop: 0,
					'& .MuiAvatar-root': {
						width: 30,
						height: 30,
					},
					'& .MuiSvgIcon-root': {
						fontSize: 18,
					},
				},
				'& .MuiListItemText-root': {
					'& span, & p': {
						fontSize: 12,
					},
				},
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

export default activityRowStyles;
