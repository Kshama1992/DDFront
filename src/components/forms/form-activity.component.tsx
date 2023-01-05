import React, { useCallback, useContext, useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import DialogContent from '@mui/material/DialogContent';
import dayjs, { Dayjs, extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import minMax from 'dayjs/plugin/minMax';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Controller, useForm } from 'react-hook-form';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Dialog from '@mui/material/Dialog';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormHelperText from '@mui/material/FormHelperText';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import AddCCComponent from '@pages/payment-methods/add-cc.component';
import { AuthContext } from '@context/auth.context';
import SpaceService from '@service/space.service';
import UserService from '@service/user.service';
import InvoiceService from '@service/invoice.service';
import SelectSpaceTypeComponent from '@forms/elements/select-space-type.component';
import SelectDateComponent from '@forms/elements/select-date.component';
import SelectReservationTimeComponent from '@forms/elements/select-reservation-time.component';
import CheckboxComponent from '@forms/elements/checkbox.component';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import VenueFilter from 'dd-common-blocks/dist/interface/filter/venue-filter.interface';
import UserFilterInterface from 'dd-common-blocks/dist/interface/filter/user-filter.interface';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);
extend(isSameOrAfter);
extend(isSameOrBefore);
extend(minMax);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
			'& .MuiFormLabel-root': {
				textTransform: 'uppercase',
				fontSize: 15,
				fontWeight: 500,
				color: theme.palette.text.primary,
				paddingBottom: '15px !important',
			},
		},
		formControl: {
			width: '100%',
		},
		container: {
			padding: '0 35px 25px 35px',
			[theme.breakpoints.down('md')]: {
				padding: '0 15px 25px 1s5px',
			},
		},
	})
);

export default function FormActivityComponent({ onSave }: { onSave: () => any }) {
	const classes = useStyles({});
	const invoiceService = new InvoiceService();
	const spaceService = new SpaceService();
	const userService = new UserService();
	const { authBody, isBrandAdmin, isSuperAdmin } = useContext(AuthContext);

	const steps = ['Select user', 'Select space for activity', 'Select preferable date/time', 'Choose billing options'];

	const { showSnackBar } = useContext(SnackBarContext);

	const [timeFormat, setTimeFormat] = useState<string>('HH:mm');
	const [startTime, setStartTime] = useState<Dayjs | undefined>();
	const [endTime, setEndTime] = useState<Dayjs | undefined>();

	const [startTimeVisible, setStartTimeVisible] = useState(false);
	const [endTimeVisible, setEndTimeVisible] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [ccVisible, setccVisible] = useState(false);
	const [spaceFilters, setSpaceFilters] = useState<SpaceFilterInterface>({
		spaceTypeId: undefined,
		venueId: undefined,
		status: SpaceStatus.PUBLISH,
		brandId: isBrandAdmin && authBody ? authBody.brandId : undefined,
	});
	const [selectedSpaceCredits, setSelectedSpaceCredits] = useState<{
		spaceId: number;
		creditBalance: number;
		creditHours: number;
		billable: number;
	}>({ spaceId: 0, creditHours: 0, creditBalance: 0, billable: 0 });
	const [selectedSpace, setSelectedSpace] = useState<SpaceInterface>();
	const [selectedUser, setSelectedUser] = useState<UserInterface>();
	const [showSelectDate, setShowSelectDate] = useState<boolean>(false);

	const {
		handleSubmit,
		control,
		watch,
		getValues,
		setValue,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			spaceId: '',
			spaceTypeId: '',
			venueId: '',
			userId: '',
			date: dayjs().format('YYYY-MM-DD'),
			hoursFrom: '',
			hoursTo: '',
			useCredits: false,
			takePayment: '',
			teamName: undefined,
		},
		shouldUnregister: false,
	});

	const date = watch('date');
	const spaceId = watch('spaceId');
	const venueId: any = watch('venueId');
	const spaceTypeId: any = watch('spaceTypeId');
	const userId = watch('userId');
	const useCredits = watch('useCredits');
	const takePayment = watch('takePayment');

	const handleDateClose = () => setShowSelectDate(false);

	const loadSpace = useCallback(async () => {
		if (!spaceId) return;
		try {
			const space = await spaceService.single(spaceId);
			if (space) {
				setSelectedSpace(space);
				const isUSA = space ? space.venue.tzId.indexOf('America') !== -1 : false;
				setTimeFormat(isUSA ? 'hh:mm A' : 'HH:mm');
			}
		} catch (e) {
			console.error(e);
		}
	}, [spaceId]);

	useEffect(() => {
		setSpaceFilters({ ...spaceFilters, spaceTypeId, venueId });
	}, [spaceTypeId, venueId]);

	useEffect(() => {
		// filter other states
		if (activeStep !== 1) return;
		loadSpace().then();
	}, [spaceId]);

	useEffect(() => {
		// filter other states
		if (activeStep !== 0) return;
		if (userId)
			userService.single(userId).then((u) => {
				setSelectedUser(u);
				setSpaceFilters({ ...spaceFilters, excludeIds: u.subscriptions?.map((s) => Number(s.spaceId)) || [] });
			});
		else setSelectedUser(undefined);
	}, [userId]);

	useEffect(() => {
		if (takePayment)
			userService.getCards(userId).then((ccs) => {
				if (ccs.length === 0) setccVisible(true);
			});
	}, [takePayment]);

	const handleNext = () => {
		if (
			((activeStep === 2 && selectedSpace && selectedSpace.spaceType.name === 'Events') ||
				(selectedSpace && selectedSpace.spaceType.name !== 'Events' && activeStep === 3)) &&
			takePayment === ''
		) {
			trigger();
			return;
		}
		if (activeStep !== steps.length) {
			setActiveStep((prevActiveStep) => {
				if (selectedSpace && selectedSpace.spaceType.name === 'Events' && prevActiveStep + 1 === 2) return 3;
				return prevActiveStep + 1;
			});
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => {
			if (selectedSpace && selectedSpace.spaceType.name === 'Events' && prevActiveStep - 1 === 2) return 1;
			return prevActiveStep - 1;
		});
	};

	const onSubmit = async (formData: any) => {
		try {
			setIsLoading(true);

			if (Object.keys(errors).length) {
				showSnackBar('Please select space');
				return;
			}

			if (!selectedSpace) {
				showSnackBar('Please select space');
				return;
			}

			if (!userId) {
				showSnackBar('Please select user');
				return;
			}

			const params: any = {
				createdById: authBody?.id,
				...formData,
				takePayment: Boolean(+formData.takePayment),
			};

			const bookDate = formData.date ? dayjs.tz(formData.date, selectedSpace.venue.tzId) : dayjs().tz(selectedSpace.venue.tzId);

			let pStart = bookDate.clone();
			let pEnd = bookDate.clone();

			if (selectedSpace.spaceType.name === 'Daypass') {
				pEnd = pEnd.endOf('day');
				pStart = pStart.startOf('day');
			}
			if (selectedSpace.spaceType.name === 'Monthly') {
				pStart = pStart.startOf('day');
				pEnd = pEnd.add(1, 'year').endOf('day');
			}
			if (selectedSpace.spaceType.name === 'Weekpass') {
				pEnd = pEnd.add(1, 'week').endOf('day');
				pStart = pStart.startOf('day');
			}

			if (selectedSpace.spaceType.name === 'Events') {
				if (typeof selectedSpace.eventData === 'undefined' || typeof selectedSpace.eventData.date === 'undefined')
					throw new Error('Event have no time data');
				const evDate = dayjs.tz(selectedSpace.eventData.date, selectedSpace.venue.tzId);
				const evEndTime = dayjs(selectedSpace.eventData.accessHoursTo as string, 'HH:mm:ss');
				const evStartTime = dayjs(selectedSpace.eventData.accessHoursFrom as string, 'HH:mm:ss');

				pEnd = evDate.hour(evEndTime.get('hour')).minute(evEndTime.get('minute'));

				pStart = evDate.hour(evStartTime.get('hour')).minute(evStartTime.get('minute'));
			}
			if ([ChargeType.HOURLY].includes(selectedSpace.chargeType)) {
				if (startTime && endTime) {
					pStart = startTime;
					pEnd = endTime;

					const givenRoundHours = endTime.diff(startTime, 'h', true);
					if (givenRoundHours < selectedSpace.roundHours) {
						showSnackBar(`Minimum booking slot for this package is ${selectedSpace.roundHours} Hours`);
						return;
					}
				} else {
					showSnackBar('Please select date and time');
					return;
				}
			}

			params.startDate = pStart.format();
			params.endDate = pEnd.format();

			params.venueId = selectedSpace.venueId;

			await invoiceService.save({ ...params, userTz: selectedSpace.venue.tzId, date: dayjs(params.date).format() });
			showSnackBar('Activity added!');
			onSave();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsLoading(false);
		}
	};

	const onAddCard = async () => {
		setccVisible(false);
	};

	const canNext = (index: number) => {
		switch (index) {
			case 0:
				return !!selectedUser;
			case 1:
				return !!selectedSpace;
			case 2:
				if (selectedSpace && [SpaceTypeLogicType.HOURLY, SpaceTypeLogicType.MINUTELY].includes(selectedSpace.spaceType.logicType!)) {
					return !!startTime && !!endTime;
				}
				return true;
			default:
				return true;
		}
	};

	const handleStartTime = (value: string) => {
		const val = dayjs(value).tz(selectedSpace?.venue.tzId);
		setStartTime(val);
		setValue('hoursFrom', val.format(timeFormat), { shouldValidate: true });
		setStartTimeVisible(false);
	};

	const handleEndTime = async (value: string) => {
		const val = dayjs(value).tz(selectedSpace?.venue.tzId);
		if ([SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(selectedSpace!.spaceType.logicType!)) {
			const formValues = getValues();

			if (!formValues.date || !formValues.hoursFrom) return 0;

			const from = dayjs(`${dayjs(formValues.date).format('YYYY-MM-DD')} ${dayjs(formValues.hoursFrom, timeFormat).format('HH:mm:ss')}`);
			const to = dayjs(`${dayjs(formValues.date).format('YYYY-MM-DD')} ${val.format('HH:mm:ss')}`);

			const credits = await userService.getSpaceCredits(
				Number(selectedUser!.id),
				[Number(selectedSpace!.id)],
				dayjs(to).diff(dayjs(from), 'h', true)
			);
			if (credits.length) {
				setSelectedSpaceCredits(credits[0]);
			}
		}
		setEndTime(val);
		setValue('hoursTo', val.format(timeFormat));
		setEndTimeVisible(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
				<Stepper activeStep={activeStep} orientation="vertical">
					{steps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
							<StepContent>
								{index === 0 && (
									<Grid container spacing={3} style={{ padding: 15, overflow: 'hidden' }}>
										<Grid item xs={12} md={6}>
											<Controller
												name="userId"
												control={control}
												rules={{ required: true }}
												render={({ field }) => (
													<AutocompleteAsync
														{...field}
														type="user"
														showLabel={false}
														filter={
															(isBrandAdmin && authBody
																? { brandId: String(authBody.brandId) }
																: {}) as UserFilterInterface
														}
													/>
												)}
											/>
										</Grid>
									</Grid>
								)}
								{index === 1 && (
									<>
										<Grid container spacing={3} style={{ padding: 15, overflow: 'hidden' }}>
											<Grid item xs={12} md={6}>
												<Controller
													render={({ field }) => (
														<AutocompleteAsync {...field} type="venue" label="Venue" filter={{} as VenueFilter} />
													)}
													name="venueId"
													rules={{ required: 'Field is required' }}
													control={control}
												/>
											</Grid>
											<Grid item xs={12} md={6}>
												<SelectSpaceTypeComponent control={control} showAll />
											</Grid>
											<Grid item xs={12}>
												<Controller
													render={({ field }) => (
														<AutocompleteAsync
															{...field}
															type="space"
															showImage
															showPrice
															label="Space"
															filter={spaceFilters as SpaceFilterInterface}
														/>
													)}
													name="spaceId"
													rules={{ required: 'Field is required' }}
													control={control}
												/>
											</Grid>
											{selectedSpace &&
												selectedSpace.packageShow === PackageShow.TEAM_MEMBERSHIP &&
												(isBrandAdmin || isSuperAdmin) && (
													<Grid item xs={6}>
														<Controller
															render={({ field }) => (
																<TextField
																	{...field}
																	variant="outlined"
																	label="Team Name"
																	fullWidth
																	InputLabelProps={{ shrink: true }}
																/>
															)}
															name="teamName"
															control={control}
															rules={{ required: 'Please choose a team name' }}
														/>
													</Grid>
												)}
										</Grid>
									</>
								)}
								{index === 2 && selectedSpace && (
									<>
										<Grid item xs={12}>
											<Grid container spacing={3} style={{ marginTop: 35, position: 'relative' }}>
												{!['Events'].includes(selectedSpace.spaceType.name) && (
													<Grid item>
														<Controller
															render={({ field }) => (
																<TextField
																	{...field}
																	onClick={() => {
																		setShowSelectDate(true);
																	}}
																	InputLabelProps={{ shrink: true }}
																	label="Date"
																	variant="outlined"
																/>
															)}
															name="date"
															control={control}
														/>
													</Grid>
												)}

												{[ChargeType.HOURLY].includes(selectedSpace.chargeType) && (
													<Grid item>
														<Controller
															render={({ field }) => (
																<TextField
																	{...field}
																	InputLabelProps={{ shrink: true }}
																	label="Start time"
																	onClick={() => setStartTimeVisible(true)}
																	variant="outlined"
																/>
															)}
															name="hoursFrom"
															control={control}
														/>
													</Grid>
												)}

												{[ChargeType.HOURLY].includes(selectedSpace.chargeType) && (
													<Grid item>
														<Controller
															render={({ field }) => (
																<TextField
																	{...field}
																	InputLabelProps={{ shrink: true }}
																	label="End time"
																	disabled={!startTime}
																	onClick={() => startTime && setEndTimeVisible(true)}
																	variant="outlined"
																/>
															)}
															name="hoursTo"
															control={control}
														/>
													</Grid>
												)}
												<Grid item xs={12} />
											</Grid>
										</Grid>
									</>
								)}

								{index === 3 && (
									<Grid container spacing={3} style={{ padding: '0 15px 30px 15px', overflow: 'hidden' }}>
										<Grid item xs={12} md={8} style={{ paddingTop: 30 }}>
											<CheckboxComponent
												disabled={
													selectedSpace &&
													(selectedSpace.notAllowCredit ||
														![SpaceTypeLogicType.HOURLY, SpaceTypeLogicType.MINUTELY].includes(
															selectedSpace.spaceType.logicType!
														))
												}
												control={control}
												name="useCredits"
												label="Use Credits"
											/>

											<Controller
												render={({ field }) => (
													<RadioGroup {...field}>
														<FormControlLabel
															disabled={!selectedUser?.brand!.chargeCustomer}
															value="1"
															control={
																<Radio
																	checkedIcon={<CheckBoxIcon />}
																	color="primary"
																	icon={<CheckBoxOutlineBlankIcon />}
																/>
															}
															label="Take payment"
														/>
														<FormControlLabel
															disabled={selectedSpace?.chargeType === ChargeType.FREE}
															value="0"
															control={
																<Radio
																	checkedIcon={<CheckBoxIcon />}
																	color="primary"
																	icon={<CheckBoxOutlineBlankIcon />}
																/>
															}
															label="Bill later"
														/>
													</RadioGroup>
												)}
												control={control}
												rules={{ required: 'Please select "Take payment" or "Bill later"' }}
												name="takePayment"
											/>

											{errors.takePayment && (
												<FormHelperText error>
													Please select &quot;Take payment&quot; or &quot;Bill later&quot;
												</FormHelperText>
											)}
										</Grid>

										{useCredits && (
											<Grid item xs={12}>
												<Typography>User credits: {selectedSpaceCredits.creditBalance}</Typography>
												<Typography>Credits will be used: {selectedSpaceCredits.creditHours}</Typography>
												<Typography>Billable hours: {selectedSpaceCredits.billable}</Typography>
											</Grid>
										)}
									</Grid>
								)}

								<div>
									<div>
										<Button disabled={activeStep === 0} onClick={handleBack}>
											Back
										</Button>
										<Button
											variant="contained"
											disabled={!canNext(index)}
											type={activeStep === steps.length ? 'submit' : 'button'}
											color="primary"
											onClick={handleNext}
										>
											{activeStep === steps.length - 1 ? 'Add Activity' : 'Next'}
										</Button>
									</div>
								</div>
							</StepContent>
						</Step>
					))}
				</Stepper>

				{isLoading && <CircularProgress style={{ marginLeft: 25 }} />}
			</form>

			<AddCCComponent
				open={ccVisible}
				onAdded={onAddCard}
				userId={userId}
				onClose={() => {
					setccVisible(false);
					setValue('takePayment', '1');
				}}
			/>

			<Dialog open={showSelectDate} onClose={handleDateClose}>
				{selectedSpace && (
					<SelectDateComponent
						space={selectedSpace}
						tzId={selectedSpace.venue.tzId}
						userId={selectedUser?.id}
						onDateSelected={(d) => {
							setValue('date', d, { shouldValidate: true, shouldDirty: true });
							setShowSelectDate(false);
						}}
					/>
				)}
			</Dialog>

			<Dialog open={startTimeVisible} onClose={() => setStartTimeVisible(false)}>
				<DialogContent>
					{selectedSpace && (
						<SelectReservationTimeComponent
							space={selectedSpace}
							tzId={selectedSpace.venue.tzId}
							date={date}
							onTimeSelected={handleStartTime}
							userId={selectedUser?.id}
						/>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={endTimeVisible} onClose={() => setEndTimeVisible(false)}>
				<DialogContent>
					{selectedSpace && (
						<SelectReservationTimeComponent
							type="end"
							tzId={selectedSpace!.venue.tzId}
							startTime={startTime}
							space={selectedSpace}
							date={date}
							onTimeSelected={handleEndTime}
							userId={selectedUser?.id}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
