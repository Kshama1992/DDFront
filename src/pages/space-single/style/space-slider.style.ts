import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

export default makeStyles((theme: Theme) =>
	createStyles({
		spaceSlider: {
			width: '100%',
			display: 'flex',
			overflow: 'hidden',
			height: '350px',
			position: 'relative',

			[theme.breakpoints.down('md')]: {
				width: '100vw',
				height: '310px',
			},
			'& .image-gallery-image': {
				height: '350px !important',
				width: '100%',
				objectFit: 'cover',
				[theme.breakpoints.down('md')]: {
					height: '310px',
				},
			},
			'& .image-gallery': {
				width: '100%',
			},

			'& .image-gallery-right-nav': {
				height: '100%',
				fontSize: '4em',
				boxShadow: 'inset -31px 0px 40px 1px rgba(0,0,0,0.4);',
				[theme.breakpoints.down('md')]: {
					display: 'none',
				},
			},
			'& .image-gallery-left-nav': {
				height: '100%',
				fontSize: '4em',
				boxShadow: 'inset 31px 0px 40px 1px rgba(0,0,0,0.4);',
				[theme.breakpoints.down('md')]: {
					display: 'none',
				},
			},
		},
		spaceSliderImage: {
			width: '100%',
		},
		checkinWrap: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
			zIndex: 9,
		},
		checkInCenterText: {
			color: '#fff',
			textAlign: 'center',
			width: '100%',
			fontSize: 35,
			paddingTop: 95,
			fontWeight: 'bold',
		},
		checkInBlock: {
			textAlign: 'center',
			paddingBottom: 90,
			'& small.MuiTypography-body1': {
				color: '#f3a42a',
				fontSize: 14,
				display: 'block',
				fontWeight: 'bold',
			},
		},
		startDate: {
			color: '#fff',
			fontSize: 25,
			fontWeight: 600,
		},
		timer: {
			color: '#fff',
			fontSize: 25,
			fontWeight: 600,
		},
		creditProgress: {
			color: '#fff',
		},
		pictureTint: {
			backgroundColor: 'rgba(0,0,0,.7)',
			position: 'absolute',
			top: 0,
			left: 0,
			height: '100%',
			width: '100%',
			zIndex: 1,
		},
		spaceSingleSpaceSits: {
			position: 'absolute',
			top: 20,
			right: 20,
			zIndex: 10,
			background: 'rgba(0,0,0,.6)',
			color: '#fff',
			padding: '3px 15px',
			borderRadius: 3,
			fontSize: 14,
			'& .MuiSvgIcon-root': {
				fontSize: 14,
				marginBottom: -3,
				marginRight: 5,
			},
			[theme.breakpoints.down('md')]: {
				bottom: 5,
				top: 'auto',
				right: 5,
			},
		},
		cardSitsText: {
			position: 'absolute',
			top: 55,
			right: 5,
			borderRadius: 3,
			height: 'auto',
			background: 'rgba(0,0,0,.6)',
			color: '#fff',
			padding: '5px 10px',
			zIndex: 100,
			fontSize: 12,
		},
		backBtn: {
			width: 40,
			height: 40,
			position: 'absolute',
			zIndex: 100,
			top: 15,
			left: 15,
			color: '#000',
			backgroundColor: '#fff',
			paddingLeft: 8,
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
	})
);
