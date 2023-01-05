import React, { useCallback, useContext, useEffect, useState } from 'react';
// import classNames from 'classnames';
import { parse as parseQueryString } from 'query-string';
import dayjs, { Dayjs, extend } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import CircularProgress from '@mui/material/CircularProgress';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import SocketEventsType from 'dd-common-blocks/dist/type/SocketEventsType';
import CCInterface from 'dd-common-blocks/dist/interface/cc.interface';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import AccessCustomDataInterface from 'dd-common-blocks/dist/interface/access-custom-data.interface';
import ReservationStatus from 'dd-common-blocks/dist/type/ReservationStatus';
import { isAccess247 } from '@helpers/user/subscription.helper';
import { AuthContext } from '@context/auth.context';
import UserService from '@service/user.service';
import { SecondsToTimeHelper } from 'dd-common-blocks';
import useMediaQuery from '@mui/material/useMediaQuery';
import InvoiceService from '@service/invoice.service';
import { SnackBarContext } from '@context/snack-bar.context';
import socket from '../../core/socket';
import ConfirmCheckoutDialog from './confirm-checkout.dialog';
import BookingPreviewComponent from './booking-preview.component';
import DialogDateComponent from './dialog-date.component';
import DialogStartTimeComponent from './dialog-start-time.component';
import DialogEndTimeComponent from './dialog-end-time.component';
import SpaceButtonsStyle from './style/space-buttons.style';

extend(customParseFormat);
extend(isSameOrBefore);
extend(minMax);
extend(isBetween);
extend(dayjsutc);
extend(dayjstimezone);

interface SpaceButtonsComponentProps {
	space: SpaceInterface;
}

export default function SpaceButtonsComponent({ space }: SpaceButtonsComponentProps) {
	const classes = SpaceButtonsStyle();
	const userService = new UserService();
	const invoiceService = new InvoiceService();

	const { authBody, userLocation, userCheckins, updateAuthData, updateCheckinData, isTeamMember } = useContext(AuthContext);
	const { pathname, search } = useLocation();
	const navigate = useNavigate();

	const queryParams = parseQueryString(search);
	const showCheckout = !!queryParams.showCheckout;

	const redirectParts = [pathname, search];
	const redirect = redirectParts.join('');

	// Used quantity > quantity or 0
	let bookDisabled = !space.quantityUnlimited && space.quantity - space.usedQuantity <= 0;

	// disable subscription and membership packages
	authBody?.subscriptions?.forEach((s) => {
		if (s.spaceId === space.id) bookDisabled = true;
	});

	// @ts-ignore
	const isMobile = useMediaQuery((t) => t.breakpoints.down('md'), { noSsr: false });

	const [startDateSrt, setStartDateSrt] = useState<string | undefined>(dayjs().format());
	const [startTime, setStartTime] = useState<Dayjs | undefined>();
	const [endTime, setEndTime] = useState<Dayjs | undefined>();
	const [availableCreditHours, setAvailableCreditHours] = useState<number | undefined>();

	const [showSelectDate, setShowSelectDate] = useState<boolean>(false);
	const [showStartTime, setShowStartTime] = useState<boolean>(false);
	const [showEndTime, setShowEndTime] = useState<boolean>(false);
	const [showPreview, setShowPreview] = useState<boolean>(false);

	const { showSnackBar } = useContext(SnackBarContext);
	const [showCheckInConfirm, setShowCheckInConfirm] = useState<boolean>(false);
	const [ongoingCheckIn, setOngoingCheckIn] = useState<ReservationInterface>();
	const [, setCheckInText] = useState<string>('Check In');
	const [, setIsCheckInEnabled] = useState<boolean>(bookDisabled || userCheckins.length > 0);
	const [showCreditsTooltip, setShowCreditsTooltip] = useState<boolean>(!isMobile);
	const [isLoadingBookBtn, setIsLoadingBookBtn] = useState<boolean>(true);
	const [isOngoingCheckIn, setIsOngoingCheckIn] = useState<boolean>(false);
	const [userCards, setUserCards] = useState<CCInterface[] | undefined>();

	const [isMembership, setIsMembership] = useState<boolean>([PackageShow.MEMBERSHIP, PackageShow.TEAM_MEMBERSHIP].includes(space.packageShow));

	const loadCards = useCallback(async () => {
		if (!authBody) return;
		try {
			const cards = await userService.getCards(authBody.id);
			setUserCards(cards);
			setIsLoadingBookBtn(false);
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

	const handleShowDate = () => {
		setShowSelectDate(true);
		setShowStartTime(false);
		setShowEndTime(false);
	};

	const bookSpace = async () => {
		if (userCards && !userCards.length && !isTeamMember) {
			return navigate(
				`/payment/methods${isMembership ? `?isFromMembership=true&redirect=${redirect}&showCheckout=true` : `?redirect=${redirect}`}`
			);
		}

		setShowCreditsTooltip(false);

		if (
			[SpaceTypeLogicType.DAILY, SpaceTypeLogicType.WEEKLY].includes(space.spaceType.logicType) ||
			([SpaceTypeLogicType.HOURLY, SpaceTypeLogicType.MINUTELY].includes(space.spaceType.logicType!) &&
				space.spaceType.logicType !== SpaceTypeLogicType.EVENT)
		) {
			return handleShowDate();
		}

		setStartTime(dayjs.tz(dayjs(), space.venue.tzId).startOf('day'));
		setEndTime(dayjs.tz(dayjs(), space.venue.tzId).add(1, 'year').endOf('day'));

		if (space.spaceType.logicType === SpaceTypeLogicType.EVENT && space.eventData) {
			setStartTime(
				dayjs
					.tz(
						`${dayjs(space.eventData.date).format('YYYY-MM-DD')} ${space.eventData.accessHoursFrom}`,
						'YYYY-MM-DD HH:mm:ss',
						space.venue.tzId
					)
					.tz(space.venue.tzId)
			);

			setEndTime(
				dayjs
					.tz(
						`${dayjs.utc(space.eventData.date).format('YYYY-MM-DD')} ${space.eventData.accessHoursTo}`,
						'YYYY-MM-DD HH:mm:ss',
						space.venue.tzId
					)
					.tz(space.venue.tzId)
			);
		}

		return setShowPreview(true);
	};

	useEffect(() => {
		if (space && authBody && showCheckout && space.spaceType.logicType !== SpaceTypeLogicType.MINUTELY) {
			bookSpace().then();
		}
	}, [showCheckout]);

	useEffect(() => {
		if (space) {
			setIsMembership([PackageShow.MEMBERSHIP, PackageShow.TEAM_MEMBERSHIP].includes(space.packageShow));
		}
	}, [space]);

	useEffect(() => {
		if (authBody && authBody.id) {
			const userOngoingReservation = space.reservation?.find(
				(r) => r.userId === authBody.id && !r.hoursTo && r.status === ReservationStatus.ACTIVE
			);
			setOngoingCheckIn(userOngoingReservation);
			setIsOngoingCheckIn(!!userOngoingReservation);

			loadCards().then();
			loadCredits().then();
		}

		let closeTime = dayjs.tz(space.venue.accessHoursTo as string, 'HH:mm:ss', space.venue.tzId).tz(space.venue.tzId);
		let openTime = dayjs.tz(space.venue.accessHoursFrom as string, 'HH:mm:ss', space.venue.tzId).tz(space.venue.tzId);

		const now = dayjs().tz(space.venue.tzId);
		const day = now.format('dddd');

		let isClosedInit = !now.isBetween(openTime, closeTime);

		if (space.venue.accessCustom) {
			const accessData = space.venue.accessCustomData;
			const todayAccess = accessData?.find((acd: Partial<AccessCustomDataInterface>) => acd.weekday === day);

			if (todayAccess) {
				closeTime = dayjs.tz(todayAccess?.accessHoursTo as string, 'HH:mm:ss', space.venue.tzId).tz(space.venue.tzId);
				openTime = dayjs.tz(todayAccess?.accessHoursFrom as string, 'HH:mm:ss', space.venue.tzId).tz(space.venue.tzId);

				if (!todayAccess.open) {
					isClosedInit = true;
				} else {
					isClosedInit = !now.isBetween(openTime, closeTime);
				}
			}
		}

		const access24: boolean = !!authBody && isAccess247(authBody, space.venue.brandId);

		setIsCheckInEnabled(!isClosedInit || access24);
		setCheckInText(authBody && isClosedInit && !access24 ? 'Closed now' : 'Check In');
		// setShowCreditsTooltip(!isClosedInit || access24);

		socket.on(SocketEventsType.DROPIN_FINISH_CRON, async (d: any) => {
			if (d.spaceId && Number(d.spaceId) === space.id) {
				setIsLoadingBookBtn(true);
				setIsOngoingCheckIn(false);
				await updateAuthData();
				await updateCheckinData();
				showSnackBar(d.message);
				setIsLoadingBookBtn(false);
				navigate('/history/past');
			}
		});
	}, []);

	const checkIn = async () => {
		setIsLoadingBookBtn(true);
		try {
			if (userCards && !userCards.length && !isTeamMember) {
				navigate(`/payment/methods?redirect=${redirect}`);
			} else {
				await invoiceService.checkIn(space.id, Number(authBody?.id), String(userLocation?.timezone));
				await updateAuthData();
				await updateCheckinData();
				navigate('/checkout');
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(
				!isTeamMember
					? {
							message: `Checkin error: ${message}`,
							link: '/payment/methods',
							linkText: 'Please add a new card here',
							state: 'error',
					  }
					: {
							message: `Checkin error: ${message}`,
							state: 'error',
					  }
			);
		} finally {
			setIsLoadingBookBtn(false);
		}
	};

	const checkOut = async () => {
		setIsLoadingBookBtn(true);
		try {
			if (userCards && !userCards.length) {
				navigate(`/payment/methods?redirect=${redirect}`);
			} else if (isOngoingCheckIn && ongoingCheckIn) {
				await invoiceService.checkOut(ongoingCheckIn.id);
				setIsOngoingCheckIn(false);
				await updateAuthData();
				await updateCheckinData();
				navigate('/history/past');
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(
				!isTeamMember
					? {
							message: `Checkout error: ${message}`,
							link: '/payment/methods',
							linkText: 'Please add a new card here',
					  }
					: `Checkout error: ${message}`
			);
		} finally {
			setIsLoadingBookBtn(false);
		}
	};

	const toggleInConfirm = () => {
		setShowCheckInConfirm(!showCheckInConfirm);
		setShowCreditsTooltip(!showCreditsTooltip);
	};

	function handleShowStartTime() {
		if (!startDateSrt) return;

		if ([SpaceTypeLogicType.DAILY, SpaceTypeLogicType.WEEKLY].includes(space.spaceType.logicType)) {
			setStartTime(dayjs.tz(startDateSrt, 'YYYY-MM-DD', space.venue.tzId).startOf('day'));

			if ([SpaceTypeLogicType.DAILY].includes(space.spaceType.logicType)) {
				setEndTime(dayjs.tz(startDateSrt, 'YYYY-MM-DD', space.venue.tzId).endOf('day'));
			}

			if ([SpaceTypeLogicType.WEEKLY].includes(space.spaceType.logicType)) {
				setEndTime(dayjs.tz(startDateSrt, 'YYYY-MM-DD', space.venue.tzId).add(1, 'week').endOf('day'));
			}

			setShowPreview(true);
		} else {
			setShowSelectDate(false);
			setShowStartTime(true);
			setShowEndTime(false);
			setShowPreview(false);
		}
	}

	const handleShowEndTime = () => {
		setShowSelectDate(false);
		setShowStartTime(false);
		setShowPreview(false);
		setShowEndTime(true);
	};

	const handleConfirm = () => {
		if (!startTime || !endTime) return;

		const givenRoundHours = endTime.diff(startTime, 'hour', true);

		if (givenRoundHours < space.roundHours) {
			showSnackBar(`Minimum booking slot for this package is ${space.roundHours} Hours`);
		} else {
			setShowPreview(true);
		}
	};

	const endTimeOnNext = (inputStartTime: Dayjs | undefined, inputEndTime: Dayjs | undefined) => {
		if (!inputStartTime || !inputEndTime) return;
		setStartTime(inputStartTime);
		setEndTime(inputEndTime);
		setShowPreview(true);
	};

	const startTimeOnNext = (inputStartTime: Dayjs | undefined) => {
		setStartTime(inputStartTime);
		handleShowEndTime();
	};

	const bookBtn = (isLoading?: boolean) => {
		let btnText = 'Book space';

		if (space.chargeType === ChargeType.FREE && space.spaceType.logicType == SpaceTypeLogicType.MONTHLY) btnText = 'Activate';

		if (![SpaceTypeLogicType.DAILY, SpaceTypeLogicType.WEEKLY].includes(space.spaceType.logicType)) {
			btnText = 'Confirm & Choose a Time';
		}

		return (
			<Button
				disabled={isLoading || !startDateSrt}
				variant="contained"
				color="primary"
				style={{ marginTop: 35 }}
				className={classes.buttonSubmit}
				onClick={handleShowStartTime}
			>
				{btnText}
				{![SpaceTypeLogicType.DAILY, SpaceTypeLogicType.WEEKLY].includes(space.spaceType.logicType) && <ChevronRightIcon />}
			</Button>
		);
	};

	const handleBackBooking = () => {
		if (!space || !authBody) return;

		if (space.spaceType.logicType === SpaceTypeLogicType.HOURLY) {
			handleShowEndTime();
		} else if (space.spaceType.logicType === SpaceTypeLogicType.MINUTELY) {
			handleShowStartTime();
		} else {
			setShowPreview(false);
		}
	};

	const handleCheckOut = async () => {
		await updateAuthData();
		showSnackBar('Thank You!');
		setShowPreview(false);
		navigate('/history/past');
	};

	const handleDateClose = () => setShowSelectDate(false);
	const handleStartTimeClose = () => setShowStartTime(false);
	const handleEndTimeClose = () => setShowEndTime(false);

	const handleSelectDate = (date: string) => {
		setStartTime(dayjs.tz(date, 'YYYY-MM-DD', space.venue.tzId));
		setStartDateSrt(date);
	};

	useEffect(() => {
		if (space.spaceType.logicType === SpaceTypeLogicType.MINUTELY) handleConfirm();
	}, [endTime]);

	if (space.spaceType.logicType === SpaceTypeLogicType.INFO)
		return (
			<div className={classes.spaceBookSpace}>
				<a href="https://drop-desk.com/request-a-quote">Email me the best deal</a>
			</div>
		);

	return (
		<>
			{!authBody && (
				<div className={classes.spaceBookSpace}>
					<Button
						component={Link}
						to={`/sign?redirect=${redirect}&spaceVisibility=${space.packageShow}&fromSpaceId=${space.id}${
							space.packageShow === PackageShow.TEAM_MEMBERSHIP ? '&isTeamLead=true' : ''
						}`}
					>
						Sign In
					</Button>
				</div>
			)}

			{space && [SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(space.spaceType.logicType) && authBody && !isOngoingCheckIn && (
				<>
					<Tooltip
						arrow
						open={typeof availableCreditHours !== 'undefined' && availableCreditHours > 0 && showCreditsTooltip}
						title={`You can use ${
							typeof availableCreditHours !== 'undefined' ? SecondsToTimeHelper(availableCreditHours * 60 * 60) : 0
						} credit hours!`}
					>
						<div className={classes.spaceBookSpace}>
							<Button disabled={isLoadingBookBtn || bookDisabled} onClick={bookSpace}>
								{space.chargeType === ChargeType.FREE && space.spaceType.logicType == SpaceTypeLogicType.MONTHLY
									? 'Activate'
									: 'Book Space'}
							</Button>
							{isLoadingBookBtn && <CircularProgress size={24} className={classes.buttonProgress} />}
						</div>
					</Tooltip>
					<br />
				</>
			)}

			{/*{space && space.spaceType.logicType === SpaceTypeLogicType.MINUTELY && !isOngoingCheckIn && authBody && (*/}
			{/*	<Tooltip*/}
			{/*		arrow*/}
			{/*		open={typeof availableCreditHours !== 'undefined' && availableCreditHours !== 0 && showCreditsTooltip}*/}
			{/*		placement="top"*/}
			{/*		title={`You can use ${*/}
			{/*			typeof availableCreditHours !== 'undefined' ? SecondsToTimeHelper(availableCreditHours * 60 * 60) : 0*/}
			{/*		} credit hours!`}*/}
			{/*	>*/}
			{/*		<div className={classNames([classes.checkInBtn, classes.spaceBookSpace])}>*/}
			{/*			<Button disabled={isLoadingBookBtn || !isCheckInEnabled} onClick={toggleInConfirm}>*/}
			{/*				{checkInText}*/}
			{/*			</Button>*/}
			{/*			{isLoadingBookBtn && <CircularProgress size={24} className={classes.buttonProgress} />}*/}
			{/*		</div>*/}
			{/*	</Tooltip>*/}
			{/*)}*/}

			{space && isOngoingCheckIn && authBody && (
				<div className={classes.spaceBookSpace}>
					<Button disabled={isLoadingBookBtn || bookDisabled} onClick={checkOut}>
						Checkout
					</Button>
					{isLoadingBookBtn && <CircularProgress size={24} className={classes.buttonProgress} />}
				</div>
			)}

			{space && ![SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(space.spaceType.logicType) && !isOngoingCheckIn && authBody && (
				<div className={classes.spaceBookSpace}>
					<Button disabled={isLoadingBookBtn} onClick={bookSpace}>
						Book Space
					</Button>
					{isLoadingBookBtn && <CircularProgress size={24} className={classes.buttonProgress} />}
				</div>
			)}

			<DialogDateComponent open={showSelectDate} space={space} actionBtn={bookBtn} onSelect={handleSelectDate} onClose={handleDateClose} />

			<DialogStartTimeComponent
				onClose={handleStartTimeClose}
				open={showStartTime}
				initialStartDate={startTime}
				onPrev={handleShowDate}
				onNext={startTimeOnNext}
				space={space}
				tzId={space.venue.tzId}
			/>

			<DialogEndTimeComponent
				initialStartDate={startTime}
				onClose={handleEndTimeClose}
				open={showEndTime}
				onPrev={handleShowStartTime}
				onNext={endTimeOnNext}
				space={space}
				tzId={space.venue.tzId}
			/>

			<ConfirmCheckoutDialog open={showCheckInConfirm} space={space} onCancel={toggleInConfirm} onOk={checkIn} isLoading={isLoadingBookBtn} />

			{space && startTime && endTime && showPreview && (
				<BookingPreviewComponent
					open={showPreview}
					onBack={handleBackBooking}
					space={space}
					onCheckout={handleCheckOut}
					startDate={startTime}
					endDate={endTime}
				/>
			)}
		</>
	);
}
