import { Theme } from '@mui/material';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const SpaceListItemComponentStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {
			padding: 0,
			fontSize: 17,
			marginBottom: 0,
			textAlign: 'left',
			[theme.breakpoints.only('lg')]: {
				fontSize: 14,
			},
		},
		subtitle: {
			padding: 0,
			fontSize: 14,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		price: {
			color: '#f7ac38',
			fontSize: 17,
			[theme.breakpoints.only('lg')]: {
				fontSize: 13,
				fontWeight: 500,
			},
		},
		openHours: {},
		address: {
			padding: 0,
			fontSize: 12,
			whiteSpace: 'pre-line',
			color: 'gray',
			[theme.breakpoints.only('lg')]: {
				fontSize: 11,
			},
		},
		distance: {
			color: theme.palette.primary.main,
			fontSize: 12,
			padding: 0,
		},
		distanceIcon: {
			fontSize: 12,
			marginBottom: -2,
		},
		media: {
			height: 176,
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				margin: '15px 15px 0 15px',
			},
		},
		cardSpaceHoverLayer: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			background: 'rgba(54, 152, 227, 0.61)',
			transition: 'all .3s ease',
		},
		cardSpaceHoverButton: {
			marginTop: 0,
			transition: 'all .3s ease',
			backgroundColor: '#f7ac38',
			padding: '17px 30px',
			color: '#fff',
		},
		cardSpaceSits: {
			position: 'absolute',
			top: 5,
			right: 5,
			borderRadius: 3,
			height: 'auto',
			background: '#20232a',
			color: '#fff',
			padding: '0 10px',
			zIndex: 100,
		},
		cardSpaceTime: {
			position: 'absolute',
			bottom: 5,
			right: 5,
			borderRadius: 3,
			height: 'auto',
			color: '#fff',
			padding: 0,
			zIndex: 100,
			'& .MuiSvgIcon-root': {
				fontSize: 15,
				marginBottom: -2,
				marginRight: 2,
			},
		},
		cardSitsText: {
			color: '#fff',
			margin: 0,
			fontSize: 14,
		},
	})
);

export default SpaceListItemComponentStyles;
