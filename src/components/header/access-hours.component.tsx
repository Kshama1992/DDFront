import React, { useCallback, useContext, useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import { venueAccessHours } from '@helpers/space/space-hours.helper';
import { AuthContext } from '@context/auth.context';
import SpaceService from '@service/space.service';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		formControl: {},
		headerUserTitle: {
			fontSize: 14,
			color: theme.palette.grey.A200,
			fontWeight: 500,
			textTransform: 'uppercase',
			marginBottom: 0,
			marginLeft: 13,
			marginTop: 5,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		headerTypoText: {
			fontWeight: 500,
			marginBottom: 0,
			marginTop: 15,
			paddingLeft: 15,
			lineHeight: '45px',
			minWidth: 235,
			fontSize: 15,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
	})
);

export default function AccessHoursComponent({ subscription }: { subscription: SubscriptionInterface | undefined }) {
	const { isAuthenticated } = useContext(AuthContext);
	const spaceService = new SpaceService();
	const classes = useStyles({});

	const { spaceId } = useParams();
	const [isLoading, setIsLoading] = useState(!!spaceId);
	const [space, setSpace] = useState<SpaceInterface | undefined>();

	let hoursString = '-';

	const loadData = useCallback(async () => {
		if (!spaceId) return;

		setIsLoading(true);
		try {
			const data = await spaceService.single(spaceId);
			if (data) {
				setSpace(data);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [spaceId]);

	useEffect(() => {
		if (isAuthenticated && typeof subscription !== 'undefined') loadData().then();
	}, [spaceId]);

	if (!isAuthenticated || typeof subscription === 'undefined') return <></>;

	if (subscription.access247) {
		hoursString = '24/7';
	} else if (space) {
		hoursString = venueAccessHours(space.venue);
	}

	return (
		<FormControl className={classes.formControl}>
			<InputLabel shrink className={classes.headerUserTitle}>
				hours of access
			</InputLabel>
			<Typography className={classes.headerTypoText}>{isLoading ? <CircularProgress /> : hoursString}</Typography>
		</FormControl>
	);
}
