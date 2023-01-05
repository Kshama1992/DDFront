import React from 'react';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import TableCell from '@mui/material/TableCell';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import TimerIcon from '@mui/icons-material/Timer';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import InvoiceItemInterface from 'dd-common-blocks/dist/interface/invoice-item.interface';
import { SecondsToTimeHelper } from 'dd-common-blocks';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		tableCell: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '5px 0',
				overflow: 'hidden',
				fontWeight: 500,
			},
			'& p, & span': { fontSize: 14 },
		},
	})
);

export default function CreditsAndDurationBlock({
	invoiceSpaceLine,
	reservation,
	spaceType,
}: {
	spaceType: SpaceTypeInterface | undefined;
	reservation: ReservationInterface | undefined;
	invoiceSpaceLine: Partial<InvoiceItemInterface> | undefined;
}) {
	const classes = useStyles({});

	if (!reservation) return <></>;

	if (
		invoiceSpaceLine &&
		spaceType &&
		spaceType.logicType &&
		[SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(spaceType.logicType)
	) {
		return (
			<TableCell colSpan={2} className={classes.tableCell}>
				<List>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<TimerIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Credits used:"
							secondary={SecondsToTimeHelper(invoiceSpaceLine.creditHours ? invoiceSpaceLine.creditHours * 60 * 60 : 0, true) as string}
						/>
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<TimerIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Total duration:"
							secondary={SecondsToTimeHelper(invoiceSpaceLine.quantity ? invoiceSpaceLine.quantity * 60 * 60 : 0, true) as string}
						/>
					</ListItem>
				</List>
			</TableCell>
		);
	}
	return <></>;
}
