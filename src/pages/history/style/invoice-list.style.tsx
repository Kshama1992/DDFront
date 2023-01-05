import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const InvoiceListStyle = makeStyles((theme: Theme) =>
	createStyles({
		wrapText: {
			// @ts-ignore
			whiteSpace: 'break-spaces !important',
			// @ts-ignore
			'& .MuiDataGrid-columnHeaderTitleContainerContent': {
				// @ts-ignore
				whiteSpace: 'break-spaces !important',
			},
		},
		avatar: {
			display: 'inline',
			[theme.breakpoints.down('sm')]: {
				// display: 'none',
				width: '100%',
				height: 150,
				marginBottom: -60,
				marginTop: -5,
				borderRadius: 0,
			},
		},
		dialog: {
			'& .MuiPaper-root': {
				[theme.breakpoints.down('md')]: {
					padding: 0,
					width: '100%',
					maxWidth: '100%',
					maxHeight: '100%',
					margin: 0,
				},
			},
		},
	})
);

export default InvoiceListStyle;
