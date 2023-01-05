import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const P_SIZE = 14;

const ContactUsStyle = makeStyles((theme: Theme) =>
	createStyles({
		singleSpaceQuestionsIcon: {
			color: '#2F96E6',
			width: 30,
			textAlign: 'center',
			marginBottom: -5,
			fontSize: 20,
			marginRight: 5,
		},
		singleSpaceQuestionsMail: {
			// color: '#fff',
			cursor: 'pointer',
		},
		singleSpaceQuestionsMobile: {
			borderTop: '1px solid #dfdfdf',
			padding: '30px 0px 100px',
			'& > a:-webkit-any-link': {
				color: '#2F96E6',
				textDecoration: 'none',
			},
		},
		singleSpaceQuestions: {
			position: 'absolute',
			right: '5%',
			top: '28%',
			border: '1px solid #ddd',
			borderRadius: 5,
			padding: '20px 20px 10px',
			[theme.breakpoints.down('md')]: {
				position: 'relative',
				textAlign: 'center',
				right: 0,
				marginTop: 40,
				maxWidth: 250,
			},
			'& > a:-webkit-any-link': {
				color: '#2F96E6',
				textDecoration: 'none',
				marginRight: '15px',
			},
		},
		questionLink: {
			// color: '#fff',
			textDecoration: 'none',
			fontSize: P_SIZE,
			marginBottom: 10,
			display: 'inline-block',
			width: '100%',
			[theme.breakpoints.down('md')]: {
				paddingTop: 10,
				display: 'inline-block',
				width: '100%',
			},
			'& p': {
				fontSize: P_SIZE,
				paddingLeft: 15,
			},
		},
	})
);

export default ContactUsStyle;
