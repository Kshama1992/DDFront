import React, { useContext } from 'react';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { Link } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Typography from '@mui/material/Typography';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
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

export default function BookedByBlock({
	reservation,
	canEdit,
	createdBy,
}: {
	reservation: ReservationInterface | undefined;
	canEdit: boolean;
	createdBy: UserInterface;
}) {
	const classes = useStyles({});
	const { isSuperAdmin, authBody } = useContext(AuthContext);

	// admin created custom invoice
	if (!reservation)
		return (
			<Typography component="span" className={classes.textSecondary}>
				by {`${createdBy.firstname} ${createdBy.lastname}`}
			</Typography>
		);

	if (createdBy.id === reservation.userId) return <></>;

	const canFollowLink = (isSuperAdmin || createdBy.brandId === authBody?.brandId) && canEdit;

	if (canFollowLink)
		return (
			<Typography component="p" className={classes.textSecondary}>
				by
				<Typography component={Link} to={`/dashboard/community/members/${createdBy.id}`} className={classes.textSecondaryLink}>
					{`${createdBy.firstname} ${createdBy.lastname}`}
				</Typography>
			</Typography>
		);
	return (
		<Typography component="p" className={classes.textSecondary}>
			by {`${createdBy.firstname} ${createdBy.lastname}`}
		</Typography>
	);
}
