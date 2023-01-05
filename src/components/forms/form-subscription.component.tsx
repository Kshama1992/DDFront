// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import dayjs, { extend, unix } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Radio } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import SubscriptionCreditHoursInterface from 'dd-common-blocks/dist/interface/subscription-credit-hours.interface';
import HoursType from 'dd-common-blocks/dist/type/HoursType';
import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import AddCCComponent from '@pages/payment-methods/add-cc.component';
import { AuthContext } from '@context/auth.context';
import FormAccessHoursComponent from '@forms/form-access-hours.component';
import CheckboxComponent from '@forms/elements/checkbox.component';
import SwitchComponent from '@forms/elements/switch.component';
import SpaceTypeService from '@service/space-type.service';
import UserService from '@service/user.service';
import PackageTypeVisibilityBlock from '@forms/blocks/package-type-visibility';
import BrandChipsBlock from '@forms/blocks/brand-chips';
import VenueTypesBlock from '@forms/blocks/venue-types-chips';
import VenueChipsBlock from '@forms/blocks/venue-chips';
import SelectSubscriptionStatusComponent from '@forms/elements/select-subscription-status.component';
import SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';
import SpaceHoursInterface from 'dd-common-blocks/dist/interface/space-hours.interface';
import SubFormValues from '@forms/interface/sub-form.interface';
import SpaceService from '@service/space.service';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SubscriptionService from '@service/subscription.service';
import ConfirmDialog from '@shared-components/confirm.dialog';
import { PACIFIC_TZ } from '@core/config';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);
extend(localeData);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			padding: 0,
		},
		checkbox: {
			'&.Mui-disabled': {
				color: 'rgba(0, 0, 0, 0.26)',
				'& .MuiIconButton-label, & .MuiTypography-root': {
					color: 'rgba(0, 0, 0, 0.26)',
				},
			},
			'& .MuiTypography-root': {
				fontSize: '11px !important',
				textTransform: 'none !important',
			},
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
		switchLabel: {
			marginLeft: 0,
			fontSize: 12,
		},
		timeField: {
			maxWidth: 125,
			fontSize: 11,
			marginTop: -3,
			'& input': {
				padding: '12px 10px',
				fontSize: 11,
			},
		},
		tabTitleWrapper: {
			borderBottom: `1px solid ${theme.palette.grey.A100}`,
			borderTop: `1px solid ${theme.palette.grey.A100}`,
			padding: 15,
			fontSize: 15,
			fontWeight: 500,
			justifyContent: 'space-between',
			display: 'flex',
		},
		container: {
			padding: 35,
			[theme.breakpoints.down('md')]: {
				padding: 0,
				paddingTop: 20,
			},
		},
		borderRight: {
			borderRight: '1px solid rgba(0, 0, 0, 0.12)',
			[theme.breakpoints.down('md')]: {
				borderRight: 'none',
			},
		},
		title: {
			textTransform: 'uppercase',
			marginBottom: 5,
			fontSize: 13,
		},
		radioCheckBox: {
			'& .MuiTypography-root': {
				fontSize: 12,
			},
		},
		hiddenField: {
			width: 0,
			height: 0,
			opacity: 0,
		},
	})
);

const DEFAULT_SUBSCRIPTION: SubFormValues = {
	userId: '',
	spaceId: '',
	isOngoing: true,
	takePayment: undefined,
	access247: false,
	name: '',
	chargeType: ChargeType.MONTHLY,
	securityAmount: 0,
	spaceAmount: 0,
	status: SubscriptionStatus.ACTIVE,
	startDate: dayjs().format(),
	endDate: dayjs().add(1, 'year').format(),
	creditHours: [
		{
			given: 0,
			type: HoursType.CHECK_IN,
			recurringMonth: 0,
			monthlyAmount: 0,
			notRecurring: false,
			recurringForever: false,
			rollover: false,
			used: 0,
		},
		{
			given: 0,
			type: HoursType.CONFERENCE,
			recurringMonth: 0,
			monthlyAmount: 0,
			notRecurring: false,
			recurringForever: false,
			rollover: false,
			used: 0,
		},
	],
	billCycleDate: 1,
};

export default function FormSubscriptionComponent({
	initialValues,
	brandId,
	onSave,
	onCancel,
	user,
}: {
	initialValues?: SubFormValues;
	brandId?: number;
	onSave: (data: SubFormValues) => any;
	onCancel: () => any;
	user: UserInterface | undefined;
}) {
	const editableSubscription = initialValues;
	const spaceTypeService = new SpaceTypeService();
	const userService = new UserService();
	const spaceService = new SpaceService();
	const subscriptionService = new SubscriptionService();

	const classes = useStyles({});
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);

	const [resetBillCycleConfirmVisible, setResetBillCycleConfirmVisible] = useState<boolean>(false);
	const [selectedSpace, setSelectedSpace] = useState<SpaceInterface | undefined>(editableSubscription && editableSubscription.space);
	const [spaceTypeList, setSpaceTypeList] = useState<SpaceTypeInterface[]>([]);
	const [userSpaceType, setPackageSpaceTypes] = useState<Partial<SpaceTypeInterface>[]>(editableSubscription?.spaceTypes || []);
	const [subBrands, setSubBrands] = useState<BrandInterface[]>(initialValues && initialValues.brands ? initialValues.brands : []);

	const [subVenueTypes, setSubVenueTypes] = useState<VenueTypeInterface[]>(
		initialValues && initialValues.venueTypes ? initialValues.venueTypes : []
	);
	const [subVenues, setSubVenues] = useState<VenueInterface[]>(initialValues && initialValues.venues ? initialValues.venues : []);

	const loadSpaceTypes = useCallback(async () => {
		const [spaceTypes] = await spaceTypeService.list({ onlyChildren: true });
		setSpaceTypeList(spaceTypes);
	}, [spaceTypeList]);

	useEffect(() => {
		loadSpaceTypes().then();
	}, []);

	const [ccVisible, setccVisible] = useState(false);

	if (
		editableSubscription &&
		((editableSubscription.creditHours && editableSubscription.creditHours.length === 0) || !editableSubscription.creditHours)
	) {
		editableSubscription.creditHours = [
			{
				given: 0,
				used: 0,
				monthlyAmount: 0,
				subscriptionId: 0,
				type: HoursType.CHECK_IN,
				recurringMonth: 0,
				notRecurring: false,
				recurringForever: false,
				rollover: false,
			},
			{
				given: 0,
				used: 0,
				monthlyAmount: 0,
				subscriptionId: 0,
				type: HoursType.CONFERENCE,
				recurringMonth: 0,
				notRecurring: false,
				recurringForever: false,
				rollover: false,
			},
		];
	}

	if (editableSubscription?.teams && editableSubscription?.teams.length > 0) {
		editableSubscription.teamName = editableSubscription.teams[0].name;
	}

	const {
		handleSubmit,
		setValue,
		control,
		watch,
		reset,
		trigger,
		setError,
		clearErrors,
		formState: { errors, isDirty },
	} = useForm({
		defaultValues: editableSubscription || { ...DEFAULT_SUBSCRIPTION, userId: user ? user.id : '' },
	});

	const takePayment: string | boolean = watch('takePayment');
	const spaceIdChanged = watch('spaceId');

	const checkUserCards = useCallback(async () => {
		try {
			const cards = await userService.getCards(user ? user.id : '');
			if (cards.length === 0) setccVisible(true);
		} catch (e) {
			console.error(e);
		}
	}, [user]);

	useEffect(() => {
		// @ts-ignore
		if ((typeof takePayment && takePayment === 'true') || takePayment === true) {
			if (!user) {
				setccVisible(true);
				return;
			}
			checkUserCards().then();
		}
	}, [takePayment]);

	const save = (formData: any) => {
		const cloneData = formData;
		if (selectedSpace) {
			cloneData.name = selectedSpace.name;
		}

		if (typeof formData.id === 'undefined' || Number(formData.id) === 0) {
			cloneData.createdById = authBody?.id;
			cloneData.userId = user ? user.id : '';
		} else {
			if (cloneData.creditHours)
				cloneData.creditHours = formData.creditHours.map((ch: SubscriptionCreditHoursInterface) => {
					const clone = ch;
					clone.given = Number(ch.given);
					clone.used = Number(ch.used);
					clone.monthlyAmount = Number(ch.monthlyAmount);
					return clone;
				});

			cloneData.id = Number(cloneData.id);
			cloneData.updatedById = authBody?.id;
			delete cloneData.userId;
		}

		cloneData.startDate = dayjs(formData.startDate).startOf('day').format();
		cloneData.endDate = dayjs(formData.endDate).endOf('day').format();

		cloneData.brands = subBrands;
		cloneData.venues = subVenues;
		cloneData.venueTypes = subVenueTypes;
		cloneData.spaceTypes = userSpaceType;
		cloneData.billCycleDate = Number(formData.billCycleDate);
		cloneData.securityAmount = Number(formData.securityAmount);
		cloneData.spaceAmount = Number(formData.spaceAmount);
		cloneData.isOngoing = Boolean(formData.isOngoing);
		cloneData.takePayment = typeof takePayment === 'string' ? takePayment === 'true' : takePayment;

		if (onSave) onSave(cloneData);
	};

	const onAddCard = async () => {
		setccVisible(false);
	};

	const resetBillCycle = async () => {
		if (!editableSubscription || !editableSubscription.id) return;
		await subscriptionService.resetBillCycle(editableSubscription.id);
		if (onSave) onSave(editableSubscription);
	};

	const { fields: creditHours } = useFieldArray({
		control,
		name: 'creditHours',
	});

	useEffect(() => {
		if (!spaceIdChanged) return;
		spaceService.single(spaceIdChanged).then((space) => {
			setSelectedSpace(space);
			if (!editableSubscription) {
				setPackageSpaceTypes(space.packageSpaceTypes || []);
				setSubBrands(space.packageBrands || []);
				setSubVenueTypes(space.packageVenueTypes || []);

				const newVal = {
					...editableSubscription,
					creditHours: space.creditHours.map((ch: SpaceHoursInterface) => {
						const ch2 = ch;
						ch2.given = Number(ch.given);
						return ch2;
					}),
					securityAmount: space.securityDepositPrice || 0,
					billCycleDate: space.billCycleStart || 1,
					spaceId: space.id,
					name: space.name,
					spaceAmount: space.price || 0,
					chargeType: space.chargeType,
					access247: space.access247,
					status: SubscriptionStatus.ACTIVE,
					space,
					startDate: dayjs().format(),
					endDate: dayjs().add(1, 'year').format(),
				};

				reset(newVal, { keepDefaultValues: false });
			}

			trigger();
		});
	}, [spaceIdChanged]);

	return (
		<>
			<form onSubmit={handleSubmit(save)} className={classes.root}>
				{editableSubscription && (
					<>
						<Controller
							render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
							name="id"
							defaultValue={undefined}
							control={control}
						/>
						<Controller
							render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
							name="userId"
							defaultValue=""
							control={control}
						/>
					</>
				)}

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Controller
							name="spaceId"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<AutocompleteAsync
									{...field}
									type="space"
									showPrice
									error={!!errors.space}
									disabled={typeof editableSubscription !== 'undefined'}
									label="Available subscriptions"
									filter={
										{
											brandId,
											status: SpaceStatus.PUBLISH,
											spaceTypeIds: spaceTypeList
												.filter((st) => st.logicType === SpaceTypeLogicType.MONTHLY)
												.map((st) => st.id),
											withCreditHours: true,
											withPackageSpaceTypes: true,
											withPackageVenueTypes: true,
											withPackageVenues: true,
											withPackageBrands: true,
										} as SpaceFilterInterface
									}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									error={!!errors.name}
									disabled
									InputLabelProps={{ shrink: true }}
									fullWidth
									label="Space Name"
									variant="outlined"
								/>
							)}
							defaultValue={editableSubscription?.name}
							name="name"
							control={control}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="Security Amount"
									variant="outlined"
									fullWidth
									disabled
									InputLabelProps={{ shrink: true }}
								/>
							)}
							name="securityAmount"
							control={control}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									variant="outlined"
									fullWidth
									disabled={!editableSubscription}
									label="Space Amount"
									InputLabelProps={{ shrink: true }}
								/>
							)}
							name="spaceAmount"
							control={control}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						{selectedSpace && (
							<Grid container spacing={1}>
								<Grid item xs={12} md={6}>
									<Controller
										render={({ field }) => (
											<DatePicker
												inputFormat="MM/DD/YYYY"
												renderInput={(props) => (
													<TextField
														{...props}
														variant="outlined"
														InputLabelProps={{
															shrink: true,
														}}
														label="Start Date"
														fullWidth
														helperText={errors.startDate ? errors.startDate.message : ''}
														error={!!errors.startDate}
													/>
												)}
												disabled={!editableSubscription || !!initialValues}
												{...field}
											/>
										)}
										control={control}
										name="startDate"
										rules={{ required: 'Field is required' }}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<Controller
										render={({ field }) => (
											<DatePicker
												inputFormat="MM/DD/YYYY"
												renderInput={(props) => (
													<TextField
														{...props}
														variant="outlined"
														InputLabelProps={{
															shrink: true,
														}}
														label="End Date"
														fullWidth
														helperText={errors.endDate ? errors.endDate.message : ''}
														error={!!errors.endDate}
													/>
												)}
												disabled={!editableSubscription}
												{...field}
											/>
										)}
										control={control}
										name="endDate"
										rules={{ required: 'Field is required' }}
									/>
								</Grid>
							</Grid>
						)}
					</Grid>

					<Grid item xs={12} md={6}>
						<SelectSubscriptionStatusComponent control={control} disabled={typeof editableSubscription === 'undefined'} />
					</Grid>

					{selectedSpace && selectedSpace.packageShow === PackageShow.TEAM_MEMBERSHIP && (isBrandAdmin || isSuperAdmin) && (
						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										variant="outlined"
										label="Team Name"
										disabled={!!(editableSubscription && editableSubscription.id)}
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

					<Grid item xs={12} md={3} style={{ padding: 15, paddingLeft: 25 }}>
						<CheckboxComponent
							control={control}
							disabled={editableSubscription && !editableSubscription.id}
							name="isOngoing"
							label="Is ongoing"
						/>

						<Controller
							render={({ field }) => (
								<RadioGroup {...field}>
									<FormControlLabel
										className={classes.radioCheckBox}
										disabled={typeof editableSubscription !== 'undefined' || (user && user.brand && !user.brand.chargeCustomer)}
										value={true}
										control={<Radio checkedIcon={<CheckBoxIcon />} color="primary" icon={<CheckBoxOutlineBlankIcon />} />}
										label="Take payment"
									/>
									<FormControlLabel
										className={classes.radioCheckBox}
										disabled={
											typeof editableSubscription !== 'undefined' ||
											(selectedSpace && selectedSpace.chargeType === ChargeType.FREE)
										}
										value={false}
										control={<Radio checkedIcon={<CheckBoxIcon />} color="primary" icon={<CheckBoxOutlineBlankIcon />} />}
										label="Bill later"
									/>
								</RadioGroup>
							)}
							control={control}
							rules={{ validate: (val) => (val === undefined ? 'Please select "Take payment" or "Bill later"' : true) }}
							name="takePayment"
						/>

						{errors.takePayment && (
							<FormHelperText error>Please select &quot;Take payment&quot; or &quot;Bill later&quot;</FormHelperText>
						)}
					</Grid>

					{/*// @ts-ignore*/}
					{!initialValues?.providerData && !initialValues?.providerData.length && initialValues?.billCycleDate && (
						<Grid item xs={12} md={3} style={{ paddingLeft: 21 }}>
							<FormControl fullWidth>
								<InputLabel shrink>Bill Cycle Date</InputLabel>
								<InputLabel>{initialValues?.billCycleDate}</InputLabel>
							</FormControl>
						</Grid>
					)}

					{/*// @ts-ignore*/}
					{initialValues?.providerData && initialValues?.providerSubscription && (
						<Grid item xs={12} md={3} style={{ paddingLeft: 21 }}>
							<FormControl fullWidth>
								<InputLabel shrink>Bill Cycle Date</InputLabel>
								{/*// @ts-ignore*/}
								<InputLabel>{unix(initialValues?.providerSubscription.current_period_start).tz(PACIFIC_TZ).date()}</InputLabel>
							</FormControl>
						</Grid>
					)}

					{editableSubscription && editableSubscription.id && (
						<Grid item xs={12} md={3} style={{ paddingLeft: 21 }}>
							<Button onClick={() => setResetBillCycleConfirmVisible(true)}>Reset bill cycle to today</Button>
						</Grid>
					)}
				</Grid>

				<Divider />

				{selectedSpace && (
					<>
						<Grid container spacing={3} className={classes.container}>
							<Grid item sm={6} xs={12} className={classes.borderRight}>
								<Typography variant="subtitle2" className={classes.title}>
									Permissions
								</Typography>

								<Grid container spacing={3}>
									<Grid item xs={12}>
										<SwitchComponent control={control} disabled={!editableSubscription} name="access247" label="24/7 Access" />
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12} md={6}>
								{selectedSpace &&
									creditHours.map((hour, key: number) => (
										<FormAccessHoursComponent
											key={key}
											disabled={!editableSubscription}
											defaultValues={hour}
											showUsedHours
											watch={watch}
											control={control}
											index={key}
											isDirty={isDirty}
											setValue={setValue}
											setError={setError}
											clearErrors={clearErrors}
											errors={errors}
										/>
									))}
							</Grid>
						</Grid>
					</>
				)}

				{selectedSpace && [PackageShow.MEMBERSHIP, PackageShow.TEAM_MEMBERSHIP].includes(selectedSpace.packageShow) && (
					<Grid container spacing={3}>
						{isSuperAdmin && (
							<BrandChipsBlock
								isReadOnly={!initialValues}
								onChange={setSubBrands}
								initialValues={initialValues && initialValues.brands ? initialValues.brands : selectedSpace.packageBrands}
							/>
						)}

						<VenueTypesBlock
							isReadOnly={!initialValues}
							onChange={setSubVenueTypes}
							initialValues={initialValues && initialValues.venueTypes ? initialValues.venueTypes : selectedSpace.packageVenueTypes}
						/>

						<VenueChipsBlock
							onChange={setSubVenues}
							filter={{ brandIds: subBrands.map((pb) => Number(pb.id)), venueTypeIds: subVenueTypes.map((vt) => Number(vt.id)) }}
							brandId={isSuperAdmin ? undefined : authBody?.brandId}
							initialValues={initialValues && initialValues.venues ? initialValues.venues : selectedSpace.packageVenues}
						/>

						<PackageTypeVisibilityBlock
							isReadOnly={!initialValues}
							onSpaceTypesChange={setPackageSpaceTypes}
							initialPackagesList={
								initialValues && initialValues.spaceTypes ? initialValues.spaceTypes : selectedSpace.packageSpaceTypes!
							}
						/>
					</Grid>
				)}

				<Grid container>
					<Grid item xs={12} md={6}>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => onCancel && onCancel()}
							size="large"
							style={{ marginTop: 15, marginRight: 15 }}
						>
							Cancel
						</Button>

						<Button variant="contained" color="primary" type="submit" endIcon={<AddIcon />} size="large" style={{ marginTop: 15 }}>
							{!editableSubscription || !editableSubscription.id ? 'Create' : 'Edit'} subscription
						</Button>
					</Grid>

					{Object.keys(errors).length > 0 && (
						<Grid item xs={12} md={6}>
							<ul>
								{Object.values(errors).map(
									(v: any, i: number) =>
										v &&
										v.message && (
											<li key={i} style={{ color: 'red' }}>
												{v.message}
											</li>
										)
								)}
							</ul>
						</Grid>
					)}
				</Grid>
			</form>

			<ConfirmDialog
				actionText={'Proceed'}
				text={`Member will be charged immediately when bill cycle is reset. Do you want to proceed?`}
				open={resetBillCycleConfirmVisible}
				onClose={() => setResetBillCycleConfirmVisible(false)}
				action={resetBillCycle}
			/>

			<AddCCComponent
				open={ccVisible}
				onAdded={onAddCard}
				userId={String(user ? user.id : '')}
				onClose={() => {
					setccVisible(false);
					setValue('takePayment', false);
				}}
			/>
		</>
	);
}
