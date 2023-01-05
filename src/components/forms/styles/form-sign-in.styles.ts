import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';

const FormSignInStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiInput-input': {
				border: 'none',
			},
			[theme.breakpoints.down('md')]: {
				'& .MuiFormLabel-root': {
					paddingLeft: 15,
					paddingTop: 15,
				},
			},
		},
		signInTitle: {
			textTransform: 'uppercase',
			color: theme.palette.primary.main,
			fontWeight: 500,
			fontSize: 15,
			textAlign: 'left',
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
		signInInput: {
			marginBottom: 20,
			// borderBottom: '2px solid #3698e3',
			'& .MuiInputBase-root': {
				margin: 0,
			},
			'& input': {
				border: 'none',
				paddingTop: 30,
				paddingBottom: 5,
			},
		},
		buttonSignIn: {
			background: theme.palette.primary.main,
			color: '#fff',
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
			border: '1px solid transparent',
			'&:hover': {
				color: theme.palette.primary.main,
				borderColor: theme.palette.primary.main,
			},
			[theme.breakpoints.down('md')]: {
				position: 'fixed',
				bottom: 0,
				left: 0,
				width: '100%',
				borderRadius: 0,
				padding: '20px 20px',
			},
		},
		buttonSignInLoading: {
			background: theme.palette.primary.main,
			color: theme.palette.primary.main,
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
		},
		signUpLink: {
			color: theme.palette.primary.main,
			textDecoration: 'none',
			cursor: 'pointer',
			padding: 0,
			'&:hover': {
				textDecoration: 'underline',
			},
			[theme.breakpoints.down('md')]: {
				textDecoration: 'underline',
				marginTop: 15,
				marginBottom: 10,
				display: 'inline-block',
			},
		},
		brnWrapperNext: {
			margin: theme.spacing(1),
			marginTop: 20,
			position: 'relative',
			width: 150,
			display: 'inline-block',
			'& button': {
				width: '100%',
			},
			[theme.breakpoints.down('md')]: {
				position: 'fixed',
				bottom: 0,
				left: 0,
				width: '100%',
				margin: 0,

				'& button': {
					width: '100%',
					padding: '20px 20px',
					borderRadius: 0,
				},
			},
		},

		brnWrapper: {
			margin: theme.spacing(1),
			marginTop: 20,
			position: 'relative',
			// width: 150,
			'& button': {
				// width: '100%',
			},
			[theme.breakpoints.down('md')]: {
				'& button': {
					width: '100%',
					borderRadius: 0,
					marginTop: 25,
				},
			},
		},
		buttonProgress: {
			color: '#fff',
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: -12,
			marginLeft: -12,
		},
		text: {
			marginTop: 15,
			marginBottom: 10,
			[theme.breakpoints.down('md')]: {
				fontWeight: 300,
				fontSize: 18,
				marginTop: 15,
				marginBottom: 25,
			},
		},
		ortext: {
			display: 'none',
			[theme.breakpoints.down('md')]: {
				fontWeight: 400,
				fontSize: 20,
				color: theme.palette.primary.main,
				marginBottom: 25,
				display: 'inline-block',
				width: '100%',
				textTransform: 'uppercase',
			},
		},
		// signUpLink: {
		// 	color: theme.palette.primary.main,
		// 	textDecoration: 'none',
		// 	padding: 0,
		// 	cursor: 'pointer',
		// 	'&:hover': {
		// 		textDecoration: 'underline',
		// 	},
		// 	[theme.breakpoints.down('md')]: {
		// 		marginTop: 15,
		// 		marginBottom: 10,
		// 		display: 'inline-block',
		// 	},
		// },
	})
);

export default FormSignInStyles;
