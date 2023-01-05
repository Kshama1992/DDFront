import React from 'react';
import pluralize from 'pluralize';
import Typography from '@mui/material/Typography';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';

const useStyles = makeStyles(() =>
	createStyles({
		cardSitsText: {
			color: '#fff',
			margin: 0,
			fontSize: 14,
		},
	})
);

export default function SpaceSeatsComponent({ space }: { space: SpaceInterface }) {
	const classes = useStyles();

	if (space.hideQuantity) return <></>;

	return (
		<Typography component="p" className={classes.cardSitsText}>
			{space.quantityUnlimited ? 'Unlimited' : `${pluralize('Seat', space.quantity - space.usedQuantity, true)} Available`}
		</Typography>
	);
}
