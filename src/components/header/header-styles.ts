import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: 0,
			margin: 0,
			boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.5)',
			position: 'fixed',
			zIndex: 999,
			background: '#fff',
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
			// paddingRight: '3%',
		},
		headerUserLogo: {
			width: '90%',
			height: 'auto',
			verticalAlign: 'middle',
			maxHeight: 70,
		},
		headerUserTitle: {
			fontSize: 14,
			fontWeight: 500,
			textTransform: 'uppercase',
			marginBottom: 0,
			marginLeft: 13,
			marginTop: 4,
			overflow: 'visible',
			width: '120%',
		},
		headerTypoText: {
			fontWeight: 500,
			marginBottom: 0,
			marginTop: 15,
			paddingLeft: 15,
			lineHeight: '45px',
			// minWidth: 235,
			fontSize: 14,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		headerUserText: {
			fontWeight: 500,
			marginBottom: 0,
			marginTop: 4,
			fontSize: 12,
			color: '#a0a0a1',
		},
		headerUserBook: {
			background: '#202033',
			borderRadius: 40,
			color: '#fff',
			maxHeight: 40,
			'&::-moz-focusring': {
				border: 0,
				outline: '0 !important',
			},
			'&::-moz-focus-inner': {
				border: 0,
				outline: '0 !important',
			},
		},
		headerUserNotifications: {
			padding: 6,
			background: '#f2f2f2',
			color: '#f6aa34',
			'& .MuiSvgIcon-root': {
				width: '0.8em',
				height: '0.8em',
			},
			'& .MuiBadge-badge': {
				backgroundColor: theme.palette.primary.main,
				fontSize: 12,
				minWidth: 17,
				width: 17,
				height: 17,
			},
		},
		headerUserName: {
			fontSize: 16,
			fontWeight: 400,
			marginBottom: 0,
			padding: 15,
			cursor: 'pointer',
		},
		headerUserPhoto: {
			border: '1px solid #ececec',
			cursor: 'pointer',
		},
		headerUserDrop: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
		},
		headerUserDropCaret: {
			color: theme.palette.primary.main,
			marginLeft: 10,
			cursor: 'pointer',
		},
		link: {
			textDecoration: 'none',
			display: 'inline-block',
			outline: 'none',
		},
		hideHover: {
			textDecoration: 'none',

			'&:hover .MuiButtonBase-root': {
				background: 'transparent',
				textDecoration: 'none',
				color: '#333',
			},
		},
		formControl: {},

		selectFilters: {
			margin: 0,
			padding: 0,
			width: 180,
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
			},
			'& .MuiSelect-select.MuiSelect-select p': {
				color: '#333',
			},
			'&:before, &:after': {
				display: 'none',
			},
			'& > div': {
				border: 'none',
			},
			'& div div ': {
				border: 'none',
				fontSize: 15,
				textAlign: 'left',
				color: theme.palette.primary.main,
				background: '#fff !important',
				padding: 0,
				minWidth: '110px',
				width: '95%',
			},
		},

		selectDisable: {
			'&:focus': {
				background: 'transparent',
			},
			'&:hover': {
				background: 'rgba(0, 0, 0, 0.12)',
			},
		},
		middleScreenHeader: {
			display: 'flex',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
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
			border: '2px solid #2F96E6',
			fontSize: 13,
			borderRadius: 3,
			transition: 'all .2s ease',
			padding: '10px 15px',
			fontWeight: 400,
			textTransform: 'uppercase',
		},
		signInDesktop: {
			color: theme.palette.primary.main,
			'&:hover': {
				backgroundColor: '#3698e3',
				color: '#fff',
			},
		},
		ButtonSignup: {
			paddingRight: 30,
			display: 'flex',
		},
		loginDesktop: {
			backgroundColor: theme.palette.primary.main,
			color: '#fff',
			'&:hover': {
				backgroundColor: '#2083d0',
			},
		},
		activeSidebarItem: {
			backgroundColor: '#2F96E6',
			color: '#fff',
		},
		selectHoursType: {
			height: 67,
			marginTop: 5,
			minWidth: 170,
			width: '100%',
			'& .MuiSvgIcon-root': {
				top: 25,
				right: -38,
				fontSize: 35,
				color: theme.palette.primary.main,
			},
			'&:before, &:after': {
				display: 'none',
			},
			'&:focus': {
				background: 'none',
			},
			'& .MuiSelect-select.MuiSelect-select': {
				fontSize: 14,
				height: '100%',
				// color: '#a0a0a1',
				fontWeight: 500,
				textTransform: 'uppercase',
				marginBottom: 0,
				marginLeft: 0,
				marginTop: 0,
				paddingTop: 0,
			},
		},
	})
);
