import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'react-multi-carousel/lib/styles.css';

const P_SIZE = 14;
const TITLE_SIZE = 17;

const SpaceSinglePageStyle = makeStyles((theme: Theme) =>
	createStyles({
		spaceDetailsWrapper: {
			height: 'calc(100vh - 70px) !important',
		},
		sectionWrap: {
			marginBottom: 30,
			paddingTop: 35,
			paddingLeft: 25,
			[theme.breakpoints.down('md')]: {
				paddingLeft: 0,
				overflow: 'hidden',
				marginBottom: 15,
				paddingTop: 15,
			},
		},
		amenityPrice: {
			'&::before': {
				content: `'\\0028 '`,
				marginRight: 2,
			},
			'&::after': {
				content: `' \\0029'`,
				marginLeft: 2,
			},
			display: 'inline',
			marginLeft: 5,
			fontWeight: 600,
		},
		sectionWrapDivider: {
			paddingBottom: 30,
			paddingTop: 35,
			paddingLeft: 25,
			borderTop: '1px solid #dfdfdf',
			overflow: 'hidden',
			// borderBottom: '1px solid #dfdfdf',
			[theme.breakpoints.down('md')]: {
				paddingLeft: 0,
				overflow: 'hidden',
				marginBottom: 15,
				paddingTop: 0,
				paddingBottom: 0,
				border: 'none',
			},
		},
		spacesPage: {
			width: 'calc(100% - 90px)',
			paddingTop: 70,
			height: '100vh',
			margin: 0,
			marginLeft: 90,
		},
		spacesPageGuest: {
			width: '100%',
			margin: 0,
			paddingTop: 70,
			height: '100vh',
		},
		spacesPageMobile: {
			width: '100vw',
			margin: 0,
			marginLeft: 0,
			paddingTop: 70,
			height: '100vh',
			[theme.breakpoints.down('md')]: {
				paddingBottom: 70,
			},
		},
		spaceTop: {
			display: 'flex',
			width: '100%',
			height: 50,
			padding: '0 5%',
			borderBottom: '1px solid  #dfdfdf',
			boxSizing: 'border-box',
		},
		spaceTopDetails: {
			padding: '20px 5%',
			// borderBottom: '1px solid #dfdfdf',
			position: 'relative',
		},
		spaceTopView: {
			textDecoration: 'none',
			textAlign: 'right',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			border: '1px solid #ccc',
			padding: '9px 10px',
			borderRadius: 5,
			width: 210,
			float: 'left',
			marginRight: 15,
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
				fontSize: 18,
				marginRight: 10,
				marginBottom: -2,
			},
			'& > p': {
				marginBottom: 0,
				fontSize: 12,
			},
			'& > span': {
				width: 15,
				height: 15,
				background: '#2F96E6',
				color: '#fff',
				borderRadius: '50%',
				fontSize: 10,
				marginRight: 10,
				'&:before': {
					margin: '2px 3px 3px 4px',
					display: 'block',
				},
			},
			[theme.breakpoints.only('lg')]: {
				// width: '100%',
				textAlign: 'center',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
			[theme.breakpoints.down('md')]: {
				// width: '100%',
				justifyContent: 'center',
			},
		},
		textIcon: {
			fontSize: 14,
			marginBottom: -2,
			marginRight: 5,
			color: theme.palette.primary.main,
		},
		rightText: {
			padding: '0 15px 15px 0',
		},
		spaceDetailsType: {
			padding: '0 15px 15px 20px',

			// borderBottom: '1px solid  #dfdfdf',
			[theme.breakpoints.down('md')]: {
				padding: '0 5% 0 5%',
			},
			'& p, & span': {
				fontSize: P_SIZE,
				fontWeight: 300,
				color: '#333',
				fontFamily: '"Lato", sans-serif',
			},
			'& .read-more-button': {
				cursor: 'pointer',
				color: theme.palette.primary.main,
				display: 'inline',
			},
		},
		amenityName: {
			padding: '15px 15px 15px 20px',
			[theme.breakpoints.down('md')]: {
				padding: '15px 5% 15px 5%',
				'& p, & span': {
					fontSize: P_SIZE - 2,
				},
			},
			'& p, & span': {
				fontSize: P_SIZE,
			},
		},
		spaceFeatures: {
			padding: '5px 15px 5px 20px',

			// borderBottom: '1px solid  #dfdfdf',
			[theme.breakpoints.down('md')]: {
				padding: '5px 5% 5px 5%',
			},
			'& p': {
				fontSize: P_SIZE,
			},
		},
		venueDescriptionTitle: {
			[theme.breakpoints.down('md')]: {
				textAlign: 'center',
				marginBottom: 25,
			},
		},
		venueDescription: {
			padding: '25px 5% 15px 5%',
			borderTop: '1px solid #dfdfdf',
			borderBottom: '1px solid #dfdfdf',
			// borderBottom: '1px solid  #dfdfdf',
			[theme.breakpoints.down('md')]: {
				padding: '15px 5% 15px 5%',
			},
		},
		spaceTypeTitle: {
			fontWeight: 500,
			fontSize: TITLE_SIZE,
			color: '#333',
			width: '100%',
			position: 'relative',
			display: 'inline-block',
			textAlign: 'left',
			marginLeft: 20,
			marginBottom: 20,
			[theme.breakpoints.down('md')]: {
				marginBottom: 10,
				marginTop: 30,
				fontSize: TITLE_SIZE + 1,
				textAlign: 'left',
				'&::before': {
					content: `''`,
					position: 'absolute',
					left: 0,
					top: 30,
					width: '10%',
					height: 1,
					backgroundColor: '#2F96E6',
				},
			},
		},

		spaceOptsTitle: {
			textAlign: 'left',
			fontWeight: 500,
			fontSize: P_SIZE,
			marginBottom: 10,
			color: '#333',
			width: '100%',
			position: 'relative',
			textTransform: 'uppercase',
			display: 'inline-block',
			[theme.breakpoints.down('md')]: {
				fontSize: 11,
				marginBottom: 30,
			},
		},
		spaceFiltersTitle: {
			marginTop: 25,
			marginBottom: 0,
			textAlign: 'center',
			[theme.breakpoints.only('lg')]: {
				fontSize: P_SIZE,
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 12,
				marginTop: 0,
			},
		},
		spaceFiltersTitleBold: {
			marginTop: 5,
			marginBottom: 0,
			fontWeight: 500,
			[theme.breakpoints.only('lg')]: {
				fontSize: P_SIZE,
			},
		},
		singleSpaceHoursTitle: {
			paddingLeft: 10,
			[theme.breakpoints.down('md')]: {
				paddingLeft: 10,
			},
		},
		singleSpaceHours: {
			borderBottom: '1px solid #dfdfdf',
			padding: '30px 4%',
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				padding: '15px 5% 80px 5%',
				textAlign: 'center',
			},
		},
		singleSpaceQuestionsTitle: {
			textAlign: 'center',
			textTransform: 'uppercase',
			fontWeight: 500,
		},

		spaceSingleName: {
			fontSize: 20,
			fontWeight: 500,
			[theme.breakpoints.only('lg')]: {
				fontSize: 18,
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 23,
				fontWeight: 500,
			},
			'& span': {
				fontWeight: 500,
				[theme.breakpoints.down('md')]: {
					display: 'block',
					fontSize: 23,
				},
			},
		},
		spaceSingleSpaceSits: {
			position: 'absolute',
			top: 20,
			right: 35,
			background: '#64676C',
			color: '#fff',
			padding: '3px 15px',
			borderRadius: 3,
			fontSize: P_SIZE,
			'& .MuiSvgIcon-root': {
				fontSize: P_SIZE,
				marginBottom: -3,
				marginRight: 5,
			},
			[theme.breakpoints.down('md')]: {
				right: 0,
				top: -25,
			},
			[theme.breakpoints.only('lg')]: {
				right: 5,
				fontSize: 11,
			},
		},
		singlesSpaceLocation: {
			[theme.breakpoints.only('lg')]: {
				fontSize: 13,
			},

			'& > p': {
				display: 'inline',
			},
		},
		singleSpaceAddress: {
			marginRight: 30,
			color: '#7c7c7c',
			[theme.breakpoints.only('lg')]: {
				fontSize: P_SIZE,
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 12,
			},
		},
		spaceFarFrom: {
			color: '#2F96E6',
			cursor: 'pointer',
			fontSize: P_SIZE,
			'& span': {
				marginRight: 5,
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 12,
			},
		},
		distanceIcon: {
			fontSize: P_SIZE,
			marginBottom: -2,
			marginRight: 5,
			[theme.breakpoints.down('md')]: {
				fontSize: 12,
			},
		},

		mapMarkerIcon: {
			color: '#2F96E6',
			fontSize: 16,
			marginBottom: -2,
			marginRight: 5,
		},
		mapWrapper: {
			[theme.breakpoints.down('md')]: {
				height: 400,
			},
		},
		spacePriceHolder: {
			padding: '5px 0',
			[theme.breakpoints.down('md')]: {
				paddingLeft: 25,
			},
		},
		spaceSliderPrice: {
			color: '#333',
			marginBottom: 0,
			fontWeight: 500,
			fontSize: 20,
			[theme.breakpoints.down('md')]: {
				fontWeight: 600,
			},
		},

		actionLink: {
			display: 'flex',
			fontSize: 25,
			textTransform: 'none',
			margin: '0 auto',
			marginBottom: 90,
			color: theme.palette.primary.main,
		},
		locationText: {
			textAlign: 'center',
			fontSize: 25,
			marginTop: 50,
			[theme.breakpoints.down('md')]: {
				padding: '15px 30px',
			},
		},
		locationIcon: {
			margin: '0 auto',
			fontSize: 150,
			display: 'block',
			color: '#3698e3',
			marginTop: 50,
			[theme.breakpoints.down('md')]: {
				fontSize: 70,
			},
		},
	})
);
export default SpaceSinglePageStyle;
