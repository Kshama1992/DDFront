import React, { useContext } from 'react';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { AuthContext } from '@context/auth.context';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		textSecondary: {
			fontSize: '13px !important',
			color: theme.palette.grey.A700,
			width: '100%',
			display: 'inline-block',
		},
		textSecondaryLink: {
			fontSize: 13,
			color: theme.palette.primary.main,
			width: '100%',
			paddingLeft: 5,
			textDecoration: 'none',
		},
	})
);

export default function ReservedForBlockComponent({ reservation, canEdit }: { reservation: ReservationInterface; canEdit: boolean }) {
	const classes = useStyles({});
	const { isSuperAdmin } = useContext(AuthContext);

	if (!reservation.reservedTo) return <></>;

	const reservedForString = reservation.reservedTo && `${reservation.reservedTo.firstname} ${reservation.reservedTo.lastname}`;
	const canFollowLink = isSuperAdmin || canEdit;
	if (canFollowLink)
		return (
			<Typography component="p" className={classes.textSecondary}>
				Booked for
				<Typography component={Link} to={`/dashboard/community/members/${reservation.reservedTo.id}`} className={classes.textSecondaryLink}>
					{reservedForString}
				</Typography>
			</Typography>
		);
	return (
		<Typography component="p" className={classes.textSecondary}>
			Booked for {reservedForString}
		</Typography>
	);
}
