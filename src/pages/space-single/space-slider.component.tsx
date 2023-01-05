import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import dayjs, { extend } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import pluralize from 'pluralize';
import { parse as parseQueryString } from 'query-string';
import Grid from '@mui/material/Grid';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import UserPrivatePackageInterface, { PackageStatus } from 'dd-common-blocks/dist/interface/user-private-package.interface';
import FileInterface from 'dd-common-blocks/dist/interface/file.interface';
import SocketEventsType from 'dd-common-blocks/dist/type/SocketEventsType';
import ReservationStatus from 'dd-common-blocks/dist/type/ReservationStatus';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import { AuthContext } from '@context/auth.context';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserService from '@service/user.service';
import { getWebpImageUrl } from '@helpers/webp-support.helper';
import TimerComponent from '@shared-components/timer.component';
import TimerCreditsComponent from '@shared-components/timer-credits.component';
import socket from '../../core/socket';
import SpaceSliderStyles from './style/space-slider.style';

extend(customParseFormat);
extend(isSameOrBefore);
extend(minMax);
extend(isBetween);
extend(dayjsutc);
extend(dayjstimezone);

export default function SpaceSliderComponent({ space, isCheckin = false }: { space: SpaceInterface; isCheckin?: boolean }) {
	const classes = SpaceSliderStyles();
	const userService = new UserService();

	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: false });

	const { authBody } = useContext(AuthContext);
	const { search } = useLocation();
	const queryParams = parseQueryString(search);

	const isUSA = space.venue.tzId.indexOf('America') !== -1;
	const timeFormat = isUSA ? 'hh:mm:ss A' : 'HH:mm:ss';

	const isFromMembership = !!queryParams.isFromMembership;

	const [timerVisible, setTimerVisible] = useState<boolean>(true);
	const [ongoingCheckIn, setOngoingCheckIn] = useState<ReservationInterface>();
	const [privatePackageStatus, setPrivatePackageStatus] = useState<PackageStatus>(PackageStatus.BOOKED);

	const [availableCreditHours, setAvailableCreditHours] = useState<number | undefined>();

	const images = space.photos && space.photos.length ? space.photos : space.venue.photos;

	const loadUserPrivateSpaces = useCallback(async () => {
		if (!authBody) return;
		try {
			const pps = await userService.getPrivatePackages(authBody.id);
			const current: UserPrivatePackageInterface | undefined = pps.find((ps: UserPrivatePackageInterface) => ps.spaceId === space.id);
			if (typeof current !== 'undefined') {
				setPrivatePackageStatus(current.status);
			}
		} catch (e) {
			console.error(e);
		}
	}, []);

	const loadCredits = useCallback(async () => {
		if (!authBody || ![SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(space.spaceType.logicType!)) {
			setAvailableCreditHours(0);
			return;
		}

		try {
			const credits = await userService.getSpaceCredits(authBody.id, [String(space.id!)]);
			setAvailableCreditHours(credits.length ? credits[0].creditBalance : 0);
		} catch (e) {
			console.error(e);
		}
	}, []);

	useEffect(() => {
		if (authBody && authBody.id) {
			const userOngoingReservation = space.reservation?.find(
				(r) => r.userId === authBody.id && !r.hoursTo && r.status === ReservationStatus.ACTIVE
			);
			setOngoingCheckIn(userOngoingReservation);

			loadUserPrivateSpaces().then();
			loadCredits().then();
		}
		socket.on(SocketEventsType.DROPIN_FINISH_CRON, async (d: any) => {
			if (d.spaceId && Number(d.spaceId) === space.id) {
				setTimerVisible(false);
			}
		});
	}, []);

	return (
		<>
			<div className={classes.spaceSlider}>
				{isCheckin && (
					<Grid container className={classes.checkinWrap}>
						<Grid item xs={12}>
							<Typography className={classes.checkInCenterText}>You are currently checked in!</Typography>
						</Grid>
						<Grid item xs={4} className={classes.checkInBlock}>
							<Typography className={classes.startDate}>
								{dayjs(ongoingCheckIn?.hoursFrom).tz(ongoingCheckIn?.tzLocation).format(timeFormat)}
								<Typography component="small">CHECK-IN TIME</Typography>
							</Typography>
						</Grid>

						<Grid item xs={4} className={classes.checkInBlock}>
							{timerVisible && ongoingCheckIn && (
								<Typography className={classes.timer} component="div">
									<TimerComponent date={dayjs(ongoingCheckIn.hoursFrom).tz(ongoingCheckIn.tzLocation)} />
									<Typography component="small">ELAPSED TIME</Typography>
								</Typography>
							)}
						</Grid>

						<Grid item xs={4} className={classes.checkInBlock}>
							{typeof availableCreditHours === 'undefined' && (
								<Typography className={classes.timer} style={{ fontSize: 20, lineHeight: '35px' }} component="div">
									<CircularProgress size={24} className={classes.creditProgress} />
								</Typography>
							)}
							{typeof availableCreditHours !== 'undefined' && availableCreditHours !== 0 && timerVisible && ongoingCheckIn && (
								<Typography className={classes.timer} component="div">
									<TimerCreditsComponent space={space} date={dayjs(ongoingCheckIn.hoursFrom).tz(ongoingCheckIn.tzLocation)} />
									<Typography component="small">CREDITS USED</Typography>
								</Typography>
							)}
							{typeof availableCreditHours !== 'undefined' && availableCreditHours === 0 && timerVisible && ongoingCheckIn && (
								<Typography className={classes.timer} style={{ fontSize: 20, lineHeight: '35px' }} component="div">
									NO CREDITS AVAILABLE
									<Typography component="small">CREDITS USED</Typography>
								</Typography>
							)}
						</Grid>
					</Grid>
				)}
				{isCheckin && <div className={classes.pictureTint} />}

				{space.spaceType.logicType !== SpaceTypeLogicType.INFO && isMobile && !space.hideQuantity && (
					<Typography component="p" className={classes.cardSitsText}>
						<>{space.quantityUnlimited ? 'Unlimited' : `${pluralize('Seat', space.quantity - space.usedQuantity, true)} Available`}</>
					</Typography>
				)}

				{privatePackageStatus !== PackageStatus.PENDING && !isFromMembership && (
					<Fab to={'/locations'} component={Link} aria-label="delete" className={classes.backBtn}>
						<ArrowBackIosIcon />
					</Fab>
				)}

				<ImageGallery
					items={images!.map((file: FileInterface) => ({
						original: getWebpImageUrl(process.env.RAZZLE_RUNTIME_MEDIA_URL + file.url),
					}))}
					slideInterval={3500}
					showBullets={(space.photos.length || space.venue.photos!.length) > 1}
					showFullscreenButton={false}
					lazyLoad
					showPlayButton={false}
					showThumbnails={false}
					autoPlay
				/>
			</div>
		</>
	);
}
