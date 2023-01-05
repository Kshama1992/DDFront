import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: 0,
			margin: 0,
			position: 'absolute',
			boxShadow: 'none',
			zIndex: 999,
			background: 'transparent',
			width: '100%',
			height: 70,
			right: 0,
			top: 0,
			display: 'flex',
			transition: 'all .2s ease',
			alignItems: 'center',
			justifyContent: 'space-between',
			boxSizing: 'border-box',
			borderRadius: 0,
		},
		headerUserLogo: {
			width: 'auto',
			height: 50,
			marginTop: 20,
		},
		link: {
			textDecoration: 'none',
			display: 'inline-block',
			outline: 'none',
		},

		miniContainer: {
			height: 32,
			padding: '0 0 0 50px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		ButtonBlock: {
			paddingRight: 30,
			display: 'flex',
		},
		btnBase: {
			border: `2px solid ${theme.palette.common.white}`,
			fontSize: 13,
			borderRadius: 3,
			transition: 'all .2s ease',
			padding: '10px 15px',
			fontWeight: 400,
			textTransform: 'uppercase',
		},
		signInDesktop: {
			color: theme.palette.common.white,
			'&:hover': {
				backgroundColor: theme.palette.common.white,
				color: theme.palette.primary.main,
			},
		},
		ButtonSignup: {
			paddingRight: 30,
			display: 'flex',
		},
		loginDesktop: {
			backgroundColor: theme.palette.common.white,
			color: theme.palette.primary.main,
			'&:hover': {
				backgroundColor: 'transparent',
			},
		},
	})
);
