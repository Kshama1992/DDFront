import { Theme } from '@mui/material';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const ForgotPassStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: '100vh',
			'& .react-tel-input .form-control': {
				border: 'none',
				borderBottom: '2px solid #3698e3',
				borderRadius: 0,
				padding: '10px 14px 5px 58px',
				marginBottom: 15,
			},
			'& .react-tel-input .selected-flag .flag': { marginTop: -17 },
			'& .react-tel-input .form-control:focus': {
				boxShadow: 'none',
			},
			'& .react-tel-input .selected-flag': {
				paddingLeft: 0,
			},
			'& .react-tel-input .form-control + div:before': {
				display: 'none',
			},
			'& .MuiInput-root': {
				background: 'transparent',
			},
		},
		signInForm: {
			maxWidth: 600,
			width: '100%',
			// display: 'block,',
			margin: '0 auto',
			// marginTop: '10%',
			boxSizing: 'border-box',
			padding: '35px 60px',
			textAlign: 'center',
			[theme.breakpoints.down('md')]: {
				position: 'absolute',
				top: 0,
				left: 0,
				borderRadius: 0,
				height: '100vh',
				maxWidth: '100%',
				'& .react-tel-input .form-control': {
					width: '100%',
				},
			},
		},
		signInLogo: {
			width: 200,
			display: 'block',
			margin: '0 auto',
			marginBottom: 30,
		},
		signInTitle: {
			textTransform: 'uppercase',
			color: '#3698e3',
			fontWeight: 500,
			fontSize: 15,
			textAlign: 'center',
		},
		buttonSignIn: {
			background: '#3698e3',
			color: '#fff',
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
		},
		buttonSignInLoading: {
			background: '#3698e3',
			color: '#3698e3',
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
		},
		signUpLink: {
			color: '#3698e3',
			textDecoration: 'none',
			cursor: 'pointer',
			'&:hover': {
				textDecoration: 'underline',
			},
			[theme.breakpoints.down('md')]: {
				textDecoration: 'underline',
			},
		},
		brnWrapper: {
			margin: theme.spacing(1),
			marginTop: 20,
			position: 'relative',
		},
		buttonProgress: {
			color: '#fff',
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: -12,
			marginLeft: -12,
		},
	})
);

export default ForgotPassStyles;
