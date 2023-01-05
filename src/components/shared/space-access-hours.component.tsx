import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';

import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import AccessCustomDataInterface from 'dd-common-blocks/dist/interface/access-custom-data.interface';
import { formatFromTo } from '@helpers/space/space-hours.helper';
import { AuthContext } from '@context/auth.context';
import { isAccess247 } from '@helpers/user/subscription.helper';
import EventDateComponent from '@pages/space-single/event-date.component';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		cardSitsText: {
			// position: 'absolute',
			top: 20,
			right: 5,
			borderRadius: 3,
			height: 'auto',
			background: 'rgba(0,0,0,.6)',
			color: '#fff',
			padding: '5px 10px',
			zIndex: 100,
			fontSize: 12,
			minWidth: 145,
			textAlign: 'center',
			'& .MuiSvgIcon-root': {
				fontSize: 14,
				marginBottom: -3,
				marginRight: 5,
			},
			[theme.breakpoints.down('md')]: {
				bottom: 5,
				top: 'auto',
				right: 5,
			},
		},
	})
);

function TimeHtml({ string, className }: { string: string; className?: string }) {
	const classes = useStyles();

	return (
		<Typography component="div" className={className || classes.cardSitsText}>
			<QueryBuilderIcon /> <span dangerouslySetInnerHTML={{ __html: string }} />
		</Typography>
	);
}

export default function SpaceAccessHoursComponent({ space, className }: { space: SpaceInterface; className?: string }) {
	const { authBody, isBrandAdmin, isSuperAdmin } = useContext(AuthContext);
	const classes = useStyles();

	const {
		eventData,
		spaceType,
		venue: { tzId, accessCustom, accessHoursFrom, accessHoursTo, accessCustomData },
	} = space;

	// space access time for admins without any timezones
	const isAdminView = isBrandAdmin || isSuperAdmin;

	const subscription247 = authBody && isAccess247(authBody, space.venue.brandId);

	if (!isAdminView && subscription247 && !(eventData || spaceType.name === 'Events'))
		return <TimeHtml string="Access 24/7" className={className} />;

	const timezone = tzId;

	if (eventData && spaceType.name === 'Events') {
		return (
			<Typography component="div" className={className || classes.cardSitsText}>
				<QueryBuilderIcon />{' '}
				<span>
					<EventDateComponent space={space} />
				</span>
			</Typography>
		);
	}

	const isToday = (day: string | undefined) => {
		if (!day) return false;
		return dayjs().format('dddd') === day;
	};

	let timeString = formatFromTo({ accessHoursFrom, accessHoursTo, tzId, timezone: isAdminView ? tzId : timezone });
	if (accessCustom) {
		const today = accessCustomData?.find((ad: Partial<AccessCustomDataInterface>) => isToday(ad.weekday));
		if (!today) return <></>;
		const { open, accessHoursFrom: todayAccessHoursFrom, accessHoursTo: todayAccessHoursTo } = today;
		if (!open) timeString = 'Closed today';
		else
			timeString = formatFromTo({
				accessHoursFrom: todayAccessHoursFrom,
				accessHoursTo: todayAccessHoursTo,
				tzId,
				timezone: isAdminView ? tzId : timezone,
			});
	}

	if (timeString === '') return <></>;

	return <TimeHtml string={timeString} className={className} />;
}
