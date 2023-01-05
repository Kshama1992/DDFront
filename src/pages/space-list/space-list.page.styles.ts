import { Theme } from '@mui/material';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const SpaceListPageStyles = makeStyles((theme: Theme) =>
	createStyles({
		mobileToggleViewBtn: {
			position: 'fixed',
			right: 60,
			top: 13,
			zIndex: 999,
			borderRadius: 5,
			color: theme.palette.primary.main,
			padding: 9,
		},
		spacesPage: {
			width: 'calc(100% - 90px)',
			// paddingTop: 60,
			height: 'calc(100vh - 70px)',
			backgroundColor: '#fff',
			margin: 0,
			marginLeft: 90,
		},
		spacesPageMobile: {
			width: '100vw',
			height: 'calc(100vh - 70px)',
			backgroundColor: '#fff',
			margin: 0,
			marginLeft: 0,
		},
		title: {
			paddingTop: 15,
			textAlign: 'center',
		},
		titleSkeleton: {
			paddingTop: 15,
			textAlign: 'center',
			margin: '15px auto 10px auto',
			maxWidth: 400,
		},
		spaces: {
			height: 'calc(100vh - 70px) !important',
			[theme.breakpoints.down('md')]: {
				height: 'calc(100vh - 70px) !important',
			},
		},
		textContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			textAlign: 'center',
			// height: '100%',
		},
		spacesContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
		spacesContainerItem: {
			'& > .MuiPaper-root': {
				borderRadius: 0,
			},
			[theme.breakpoints.down('md')]: {
				padding: '0 !important',
			},
		},
	})
);

export default SpaceListPageStyles;
