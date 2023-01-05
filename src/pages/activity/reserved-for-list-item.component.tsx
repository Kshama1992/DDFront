import React, { useContext } from 'react';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { AuthContext } from '@context/auth.context';

export default function ReservedForListItemComponent({ reservation, canEdit }: { reservation: ReservationInterface; canEdit: boolean }) {
	const { isSuperAdmin } = useContext(AuthContext);

	if (!reservation.reservedTo) return <></>;

	const canFollowLink = isSuperAdmin || canEdit;
	let params: any = {};

	if (canFollowLink)
		params = {
			component: Link,
			to: `/dashboard/community/members/${reservation.reservedTo.id}`,
		};

	return (
		<ListItem {...params}>
			<ListItemAvatar>
				<Avatar>
					<PersonIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={`${reservation.reservedTo.firstname} ${reservation.reservedTo.lastname}`}
				secondary={reservation.reservedTo.brand!.name}
			/>
		</ListItem>
	);
}
