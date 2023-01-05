import React, { useContext } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import { AuthContext } from '@context/auth.context';
import SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';

const useStyles = makeStyles(() =>
	createStyles({
		spaceName: {
			fontSize: 15,
			paddingTop: 5,
			fontWeight: 400,
			textDecoration: 'none',
		},
		spaceNameLaptop: {
			fontSize: 15,
			textDecoration: 'none',
			fontWeight: 400,
		},
	})
);

export default function SpaceLinkComponent({
	canEdit,
	space,
	subscription,
}: {
	subscription?: SubscriptionInterface | undefined;
	space: SpaceInterface | undefined;
	canEdit: boolean;
}) {
	const { authBody } = useContext(AuthContext);
	const classes = useStyles({});
	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	if (!authBody || !space) return <></>;

	let spaceName = space.name;
	if (space.status === SpaceStatus.DELETED) spaceName += '<b> (Package deleted)</b>';
	if (space.spaceType.logicType === SpaceTypeLogicType.MONTHLY && subscription && subscription.status === SubscriptionStatus.DELETED)
		spaceName += '<b> (Subscription deleted)</b>';
	if (space.spaceType.logicType === SpaceTypeLogicType.MONTHLY && subscription && subscription.status === SubscriptionStatus.CANCELED)
		spaceName += '<b> (Subscription canceled)</b>';

	if (canEdit)
		return (
			<Typography
				component={Link}
				to={`/dashboard/venue/${space.venueId}/space/${space.id}`}
				className={isLaptop ? classes.spaceNameLaptop : classes.spaceName}
				dangerouslySetInnerHTML={{ __html: spaceName }}
			/>
		);

	return (
		<Typography
			component="span"
			className={isLaptop ? classes.spaceNameLaptop : classes.spaceName}
			dangerouslySetInnerHTML={{ __html: spaceName }}
		/>
	);
}
