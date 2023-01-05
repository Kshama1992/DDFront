import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const FormTeamComponentStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiFormLabel-root, & .MuiFormControlLabel-label': {
				textTransform: 'uppercase',
				fontSize: 12,
				fontWeight: 500,
				color: theme.palette.text.primary,
			},
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
		},
		formControl: {
			width: '100%',
		},
		container: {
			padding: 35,
		},
		topTitle: {
			boxShadow: '0px 2px 2px 0px grey',
			'& .MuiTab-root': {
				padding: 20,
				minWidth: 130,
			},
		},
		backContainer: {
			padding: 20,
			backgroundColor: theme.palette.grey.A100,
			boxSizing: 'border-box',
		},
		backIcon: {},
		backLink: {},
		bottomWrap: {
			display: 'flex',
			justifyContent: 'flex-end',
			paddingRight: 35,
			[theme.breakpoints.down('md')]: {
				overflow: 'hidden',
				display: 'block',
				padding: 0,
				'& button': {
					minWidth: '100%',
					borderRadius: 0,
					padding: '20px 20px',
				},
			},
		},
		title: {
			textTransform: 'uppercase',
			marginBottom: 5,
			fontSize: 13,
		},
		errorText: {
			textAlign: 'center',
			margin: '15px 0',
			color: 'red',
		},
		switch: {
			marginLeft: 15,
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
		topBtn: {
			marginTop: -7,
			marginBottom: -10,
			[theme.breakpoints.down('md')]: {
				width: '100%',
				margin: '0 0 10px 0 !important',
			},
		},
	})
);

export default FormTeamComponentStyles;
