import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Theme } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		tableHeaderCell: {
			backgroundColor: '#fff',
			[theme.breakpoints.only('lg')]: {
				'& > p': {
					fontSize: 12,
				},
			},
		},
	})
);

export default function ActivityRowHeadersComponent({ showCreditHours = false }: { showCreditHours?: boolean }) {
	const classes = useStyles({});

	return (
		<TableRow>
			<TableCell className={classes.tableHeaderCell}>
				<Typography>Member</Typography>
			</TableCell>

			<TableCell className={classes.tableHeaderCell}>
				<Typography>Venue name</Typography>
			</TableCell>

			<TableCell className={classes.tableHeaderCell}>
				<Typography>Time</Typography>
			</TableCell>

			<TableCell className={classes.tableHeaderCell}>
				<Typography>Price</Typography>
			</TableCell>

			{showCreditHours && (
				<TableCell className={classes.tableHeaderCell}>
					<Typography>Credits used</Typography>
				</TableCell>
			)}

			<TableCell className={classes.tableHeaderCell}>
				<Typography>Invoice status</Typography>
			</TableCell>

			<TableCell className={classes.tableHeaderCell}>
				<Typography>Reservation status</Typography>
			</TableCell>

			<TableCell className={classes.tableHeaderCell} />
		</TableRow>
	);
}
