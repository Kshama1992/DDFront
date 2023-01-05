import React, { useContext, useState } from 'react';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { formatFromTo } from '@helpers/space/space-hours.helper';
import { AuthContext } from '@context/auth.context';
import { isAccess247 } from '@helpers/user/subscription.helper';
import WeekdaySorterHelper from '@helpers/weekday.sort.helper';
import AccessHFormValues from '@forms/interface/access-h-form-values.interface';

extend(customParseFormat);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		hooExpandIcon: {
			display: 'inline',
			padding: 0,
			marginLeft: 2,
			marginTop: 0,
			color: theme.palette.primary.main,
			'& .MuiSvgIcon-root': {
				fontSize: 30,
				marginBottom: -3,
			},
		},
		hooWeekdayWrap: {
			padding: 3,
			fontSize: 14,
			[theme.breakpoints.up('md')]: {
				paddingLeft: 0,
			},
		},
		hooWeekday: {
			[theme.breakpoints.up('md')]: {
				fontSize: 14,
				paddingLeft: 0,
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 12,
				marginTop: 0,
			},
		},
		hooWeekdayWrapHidden: {
			display: 'none',
		},
		hooWeekdayWrapToday: {
			padding: 0,
			'& span, & p': {
				fontWeight: 500,
			},
			[theme.breakpoints.up('md')]: {
				paddingLeft: 0,
			},
		},
	})
);

function SpaceAccessHoursListComponent({ space }: { space: SpaceInterface }) {
	const classes = useStyles();
	const [hoursVisible, setHoursVisible] = useState(false);
	const { authBody } = useContext(AuthContext);

	// TODO: move to somewhere

	const subscription247 = authBody && isAccess247(authBody, space.venue.brandId);

	if (subscription247)
		return (
			<Grid container>
				<Grid item xs={5} className={classes.hooWeekday}>
					<Typography>Access 24/7</Typography>
				</Grid>
			</Grid>
		);

	const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const {
		venue: { tzId, accessCustom, accessHoursFrom, accessHoursTo, accessCustomData },
	} = space;

	const timezone = tzId;

	const isToday = (day: string) => dayjs().format('dddd') === day;

	if (!accessCustom) {
		return (
			<>
				{fullDays.map((day: string, index: number) => {
					let className = isToday(day) ? classes.hooWeekdayWrapToday : classes.hooWeekdayWrap;

					if (!hoursVisible && !isToday(day)) className = classes.hooWeekdayWrapHidden;

					return (
						<Grid container className={className} key={index}>
							<Grid item xs={5} className={classes.hooWeekday}>
								<Typography>{!hoursVisible && isToday(day) ? 'Today' : day}</Typography>
							</Grid>
							<Grid item xs={7} className={classes.hooWeekday}>
								<Typography>
									{formatFromTo({ accessHoursFrom, accessHoursTo, tzId, timezone })}
									{!hoursVisible && isToday(day) && (
										<IconButton
											onClick={() => {
												setHoursVisible(true);
											}}
											className={classes.hooExpandIcon}
											size="large"
										>
											<ArrowDropDownIcon />
										</IconButton>
									)}
								</Typography>
							</Grid>
						</Grid>
					);
				})}
			</>
		);
	}
	return (
		<>
			{!!accessCustomData &&
				(accessCustomData as AccessHFormValues[]).sort(WeekdaySorterHelper).map((customData: AccessHFormValues, index: number) => {
					if (!customData.weekday) return <></>;
					let className = isToday(customData.weekday) ? classes.hooWeekdayWrapToday : classes.hooWeekdayWrap;
					if (!hoursVisible && !isToday(customData.weekday)) className = classes.hooWeekdayWrapHidden;

					const timeString = formatFromTo({
						accessHoursFrom: customData.accessHoursFrom,
						accessHoursTo: customData.accessHoursTo,
						tzId,
						timezone,
					});

					return (
						<Grid container className={className} key={index}>
							<Grid item xs={5} className={classes.hooWeekday}>
								<Typography>{!hoursVisible && isToday(customData.weekday) ? 'Today' : customData.weekday}</Typography>
							</Grid>
							<Grid item xs={7} className={classes.hooWeekday}>
								<Typography>
									{customData.open ? timeString : 'Closed'}
									{!hoursVisible && isToday(customData.weekday) && (
										<IconButton
											onClick={() => {
												setHoursVisible(true);
											}}
											className={classes.hooExpandIcon}
											size="large"
										>
											<ArrowDropDownIcon />
										</IconButton>
									)}
								</Typography>
							</Grid>
						</Grid>
					);
				})}
		</>
	);
}

export default SpaceAccessHoursListComponent;
