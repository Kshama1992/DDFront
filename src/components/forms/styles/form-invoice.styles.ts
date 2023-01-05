import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const FormInvoiceStyles = makeStyles((theme: Theme) =>
	createStyles({
		loaderWrapper: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(255,255,255,0.31)',
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		hidden: {
			width: 0,
			height: 0,
			overflow: 'hidden',
			padding: 0,
			margin: 0,
			lineHeight: 0,
			display: 'inline',
		},
		top: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
		inner: {
			position: 'relative',
			minHeight: 400,
			// padding: '30px 60px 40px',
		},
		historyDetailsWrapper: {
			maxWidth: 600,
			width: '100%',
			margin: '0 auto',
			padding: 15,
			boxSizing: 'border-box',
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				boxShadow: 'none',
			},
		},
		historyDetailsImage: {
			width: '100%',
		},

		brandLogo: {
			height: 90,
			marginTop: 15,
			marginBottom: 15,
		},
		historyDetailsStatus: {
			display: 'flex',
			justifyContent: 'space-between',
			borderTop: '1px solid #f1f1f1',
			padding: '20px 0 20px',
		},
		historyDetailsName: {
			fontWeight: 600,
			fontSize: 24,
			marginTop: 20,
			marginBottom: 0,
		},
		historyDetailsAddress: {
			opacity: 0.7,
		},
		historyDetailsBooked: {
			opacity: 0.6,
			display: 'flex',
			justifyContent: 'space-between',
		},
		historyDetailsBookedText: {
			fontSize: 16,
		},
		historyDetailsTitle: {
			textTransform: 'uppercase',
			fontWeight: 600,
		},
		historyDetailsText: {
			fontSize: 24,
		},
		historyDetailsStatusIcon: {
			color: '#3a6ce3',
		},
		historyDetailsStatusIconNotPayed: {
			color: 'red',
		},
		historyDerailsLabel: {
			background: '#efefef',
			textAlign: 'center',
			fontWeight: 600,
			padding: 10,
		},
		historyLabelText: {
			marginBottom: 0,
			color: '#929292',
			fontWeight: 600,
		},
		historyDetailsItem: {
			display: 'flex',
			justifyContent: 'flex-end',
			padding: 10,
		},
		totalText: {
			width: 100,
			color: theme.palette.primary.main,
		},
		expansionPanel: {
			margin: '0 !important',
			borderBottom: '1px solid #dfdfdf',
		},

		historyDetailsItemText: {
			marginBottom: 0,
			width: 100,
		},
		historyDetailsItemPrice: {
			marginBottom: 0,
			width: 100,
		},
		historyDerailsButton: {
			color: '#fff',
			background: '#3a6ce3',
			display: 'block',
			margin: '0 auto',
			marginTop: 30,
			marginBottom: 20,
			width: 135,
			outline: 'none',
		},
		row: {
			display: 'flex',
			flexDirection: 'row',
			marginTop: 10,
		},
		rowCentered: {
			alignItems: 'center',
			justifyContent: 'center',
		},
		border: {
			border: `1px solid ${theme.palette.divider}`,
			marginTop: 15,
		},
		disputeContainer: {
			[theme.breakpoints.down('md')]: {
				height: 'calc(100%)',
			},
		},
		itemsGap: {
			display: 'none',
			[theme.breakpoints.down('md')]: {
				display: 'block',
				height: '10vh',
			},
		},
		backButton: {
			height: 40,
			width: 40,
			margin: 20,
			textAlign: 'center',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			borderRadius: '50%',
			zIndex: 100,
			top: '0%',
			left: '0%',
			cursor: 'pointer',
			color: '#000',
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
		itemsTable: {},
		itemsTableHead: {
			backgroundColor: theme.palette.primary.main,
			'& th': {
				color: '#fff',
				fontWeight: 400,
			},
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
		closeBtn: {
			float: 'right',
			marginLeft: 100,
			backgroundColor: '#fff',
		},
		topBtn: {
			marginRight: 15,
			textTransform: 'none',
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
			},
		},
		blueText: {
			color: theme.palette.primary.main,
		},
		greyText: {
			color: theme.palette.grey.A400,
			fontWeight: 400,
		},
		textInput: {
			margin: 0,
			'& .MuiInput-underline.Mui-disabled:before': {
				display: 'none',
			},
			'& .MuiInputBase-input.Mui-disabled': {
				color: '#333',
			},
		},
		panelSummaryClosed: {
			backgroundColor: '#fff',
			height: 40,
			transition: 'all .2s ease',
			display: 'flex',
			alignItems: 'center',
			paddingLeft: '15px',
			minHeight: 'auto',
			'& p ': {
				marginBottom: 0,
				fontSize: 14,
				margin: '0 10px',
				color: theme.palette.primary.main,
				fontWeight: 600,
			},
			'& svg ': {
				marginBottom: 0,
				fontSize: 20,
				margin: '0 10px',
				color: theme.palette.primary.main,
			},
		},
		panelSummaryOpen: {
			backgroundColor: '#fff',
			height: 40,
			transition: 'all .2s ease',
			display: 'flex',
			alignItems: 'center',
			paddingLeft: '15px',
			minHeight: 'auto !important',
			'& p ': {
				marginBottom: 0,
				fontSize: 14,
				margin: '0 10px',
				color: theme.palette.primary.main,
				fontWeight: 600,
			},
			'& svg ': {
				marginBottom: 0,
				fontSize: 20,
				margin: '0 10px',
				color: theme.palette.primary.main,
			},
		},
		addBtn: {
			width: '100%',
			color: theme.palette.primary.main,
			backgroundColor: '#eee',
			borderRadius: 0,
			textAlign: 'left',
		},
		tableCell: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '5px 0',
				overflow: 'hidden',
				// fontWeight: 500,
			},
		},
		tableRow: {
			[theme.breakpoints.down('md')]: {
				borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
				display: 'inline-block',
				paddingBottom: 15,
				width: '100%',
			},
		},
		tableTH: {
			color: '#fff',
			fontWeight: 400,
		},
		mobileText: {
			display: 'none',
			color: '#333',
			fontWeight: 500,
			[theme.breakpoints.down('md')]: {
				display: 'block',
			},
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
	})
);

export default FormInvoiceStyles;
