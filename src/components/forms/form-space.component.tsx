// @ts-nocheck
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Sticky, StickyContainer } from 'react-sticky';
import { useTheme } from '@mui/material/styles';
import NumberFormat from 'react-number-format';
import { Waypoint } from 'react-waypoint';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import Dialog from '@mui/material/Dialog';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Tabs from '@mui/material/Tabs';
import DialogActions from '@mui/material/DialogActions';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Paper from '@mui/material/Paper';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link, Radio, RadioGroup } from '@mui/material';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import AmenityInterface from 'dd-common-blocks/dist/interface/amenity.interface';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import HoursType from 'dd-common-blocks/dist/type/HoursType';
import FileInterface from 'dd-common-blocks/dist/interface/file.interface';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import ChargeVariant from 'dd-common-blocks/dist/type/ChargeVariant';
import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';
import SelectSpaceTypeComponent from '@forms/elements/select-space-type.component';
import { AuthContext } from '@context/auth.context';
import ImageEditor from '@shared-components/image-editor.component';
import SelectPackageStatusComponent from '@forms/elements/select-package-status.component';
import SelectChargeTypeComponent from '@forms/elements/select-charge-type.component';
import { SnackBarContext } from '@context/snack-bar.context';
import FormAccessHoursComponent from '@forms/form-access-hours.component';
import UploadFileHelper from '@helpers/file-upload.helper';
import SelectRoundHoursComponent from '@forms/elements/select-round-hours.component';
import decodeHTMLContent from '@helpers/decode-html.helper';
import CheckboxComponent from '@forms/elements/checkbox.component';
import SwitchComponent from '@forms/elements/switch.component';
import { APP_DOMAIN, DEFAULT_CURRENCY, NODE_ENV } from '@core/config';
import { getCurrencySymbol } from 'dd-common-blocks';
import SpaceTypeService from '@service/space-type.service';
import SpaceService from '@service/space.service';
import AmenityService from '@service/amenity.service';
import BrandChipsBlock from '@forms/blocks/brand-chips';
import VenueTypeChipsBlock from '@forms/blocks/venue-types-chips';
import VenueChipsBlock from '@forms/blocks/venue-chips';
import PackageTypeVisibilityBlock from '@forms/blocks/package-type-visibility';
import AnchorLinkComponent from '@shared-components/anchor-link.component';
import ConfirmDialog from '@shared-components/confirm.dialog';
import SpaceAmenityBlockComponent from '@forms/blocks/space-amenity';
import SpaceAmenityService from '@service/space-amenity.service';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';
import FormSpaceStyles from './styles/form-space.styles';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);
extend(localeData);

function ChargeVariantBlock({
	control,
	isReadOnly,
	roundHours,
	selectedSpaceType,
	spaceChargeType,
}: {
	control: any;
	isReadOnly: boolean | undefined;
	spaceChargeType: ChargeType | undefined;
	selectedSpaceType: SpaceTypeInterface | undefined;
	roundHours: number | undefined;
}) {
	if (
		spaceChargeType === ChargeType.HOURLY &&
		!!roundHours &&
		roundHours > 0 &&
		selectedSpaceType &&
		selectedSpaceType.logicType === SpaceTypeLogicType.MINUTELY
	)
		return (
			<Grid item xs={12}>
				<FormControl component="fieldset">
					<Controller
						name="chargeVariant"
						control={control}
						defaultValue={ChargeVariant.byTimer}
						rules={{ required: true }}
						render={({ field }) => (
							<RadioGroup {...field}>
								<FormControlLabel
									disabled={isReadOnly}
									value={ChargeVariant.byTimer}
									control={<Radio />}
									label="Charge by the hour"
								/>
								<FormControlLabel
									value={ChargeVariant.byRoundHours}
									disabled={isReadOnly}
									control={<Radio />}
									label="Charge by block of time"
								/>
								<FormControlLabel
									value={ChargeVariant.byCustomAdditionalHours}
									disabled={isReadOnly}
									control={<Radio />}
									label="Charge custom amount"
								/>
							</RadioGroup>
						)}
					/>
				</FormControl>
			</Grid>
		);
	return <></>;
}

function FormSpaceComponent({
	initialValues,
	venueData,
	venueIds,
}: {
	initialValues?: SpaceInterface;
	venueData: VenueInterface;
	venueIds: number[];
}) {
	const classes = FormSpaceStyles({});
	const spaceTypeService = new SpaceTypeService();

	const navigate = useNavigate();

	const spaceService = new SpaceService();
	const amenityService = new AmenityService();
	const spaceAmenityService = new SpaceAmenityService();
	const theme = useTheme();

	const { authBody, isSuperAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	let isReadOnly = initialValues && initialValues.status === SpaceStatus.DELETED;
	if (authBody?.id !== initialValues?.createdById) isReadOnly = true;
	if (!initialValues || isSuperAdmin) isReadOnly = false;
	if ((venueData && venueData.status === VenueStatus.DELETED) || (initialValues && initialValues.status === SpaceStatus.DELETED)) isReadOnly = true;

	const { spaceId, venueId } = useParams();

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);

	const [brand, setBrand] = useState<BrandInterface | undefined>(authBody?.brand);
	const [urlCopied, setUrlCopied] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<string>('info');
	const [spaceTypeList, setSpaceTypeList] = useState<SpaceTypeInterface[]>([]);
	const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceTypeInterface | undefined>();
	const [amenityList, setAmenityList] = useState<AmenityInterface[]>([]);
	const [spaceAmenityList, setSpaceAmenityList] = useState<SpaceAmenityInterface[]>(
		initialValues && initialValues.amenities ? initialValues.amenities : []
	);
	const packageShowItems: PackageShow[] = Object.values(PackageShow);

	const [photos, setPhotos] = useState<FileInterface[]>(initialValues && initialValues.photos ? initialValues.photos : []);
	const [uploadAttachments, setUploadAttachments] = useState<string[]>([]);

	const [photoPreview, setPhotoPreview] = useState<string>('');
	const [photoPreviewVisible, setPhotoPreviewVisible] = useState<boolean>(false);
	const [editingImage, setEditingImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);

	const [packageSpaceTypes, setPackageSpaceTypes] = useState<SpaceTypeInterface[]>(
		initialValues && initialValues.packageSpaceTypes ? initialValues.packageSpaceTypes : []
	);
	const [packageBrands, setPackageBrands] = useState<BrandInterface[]>(
		initialValues && initialValues.packageBrands ? initialValues.packageBrands : []
	);
	const [packageVenueTypes, setPackageVenueTypes] = useState<VenueTypeInterface[]>(
		initialValues && initialValues.packageVenueTypes ? initialValues.packageVenueTypes : []
	);
	const [packageVenues, setPackageVenues] = useState<VenueInterface[]>(
		initialValues && initialValues.packageVenues ? initialValues.packageVenues : []
	);
	const [logoError, setLogoError] = useState<string>('');

	const [customRepublishMinute, setCustomRepublishMinute] = useState<number>(
		initialValues && initialValues.quantityRepublishCustom
			? (Number(initialValues.quantityRepublishCustom.toFixed(3).slice(2, -1)) / 100) * 60
			: 0
	);
	const [customRepublishHour, setCustomRepublishHour] = useState<number>(
		initialValues && initialValues.quantityRepublishCustom ? Number(initialValues.quantityRepublishCustom.toFixed(3).slice(0, -4)) : 0
	);

	let isUSA = venueData ? venueData.tzId.indexOf('America') !== -1 : false;
	if (initialValues && initialValues.venue) {
		isUSA = initialValues.venue.tzId.indexOf('America') !== -1;
	}
	const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

	const [chargeTypesFilter, setChargeTypesFilter] = useState<ChargeType[]>([
		ChargeType.MONTHLY,
		ChargeType.ONE_TIME,
		ChargeType.HOURLY,
		ChargeType.PRORATE,
		ChargeType.PRORATE_1,
		ChargeType.FREE,
	]);

	const changeTab = (event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};

	if (initialValues && initialValues.creditHours && !initialValues.creditHours.length) {
		// eslint-disable-next-line no-param-reassign
		initialValues.creditHours = [
			{
				id: undefined,
				createdAt: new Date(),
				updatedAt: new Date(),
				given: 0,
				type: HoursType.CHECK_IN,
				recurringMonth: 0,
				notRecurring: true,
				recurringForever: false,
				rollover: false,
			},
			{
				id: undefined,
				createdAt: new Date(),
				updatedAt: new Date(),
				given: 0,
				type: HoursType.CONFERENCE,
				recurringMonth: 0,
				notRecurring: true,
				recurringForever: false,
				rollover: false,
			},
		];
	}

	if (initialValues && initialValues.accessHoursFrom) {
		// eslint-disable-next-line no-param-reassign
		initialValues.accessHoursFrom = dayjs(initialValues.accessHoursFrom as string, 'HH:mm:ss');
	}

	if (initialValues && initialValues.accessHoursTo) {
		// eslint-disable-next-line no-param-reassign
		initialValues.accessHoursTo = dayjs(initialValues.accessHoursTo as string, 'HH:mm:ss');
	}

	if (initialValues && initialValues.eventData) {
		// eslint-disable-next-line no-param-reassign
		initialValues.eventData = {
			...initialValues.eventData,
			accessHoursTo: dayjs(initialValues.eventData.accessHoursTo as string, 'HH:mm:ss'),
			accessHoursFrom: dayjs(initialValues.eventData.accessHoursFrom as string, 'HH:mm:ss'),
		};
	}

	const initialSpace: SpaceInterface = {
		createdAt: undefined,
		createdById: 0,
		eventData: undefined,
		photos: [],
		spaceType: undefined,
		updatedAt: undefined,
		updatedById: 0,
		venue: undefined,
		venueId: 0,
		amenities: [],
		name: '',
		alias: '',
		quantityRepublishCustom: 0,
		securityDepositPrice: 0,
		price: 0,
		tax: 0,
		capacity: 1,
		access247: false,
		quantity: 1,
		usedQuantity: 0,
		spaceTypeId: undefined,
		packageShow: undefined,
		quantityRepublish: 0,
		description: '',
		chargeType: undefined,
		securityDeposit: false,
		quantityUnlimited: false,
		hideQuantity: false,
		roundHours: 0,
		customAdditionalTime: 0,
		chargeVariant: ChargeVariant.byTimer,
		status: SpaceStatus.PUBLISH,
		notAllowCredit: false,
		creditsHalf: false,
		credits2x: false,
		billCycleStart: dayjs().date(),
		creditHours: [
			{
				given: 0,
				type: HoursType.CHECK_IN,
				recurringMonth: 0,
				notRecurring: true,
				recurringForever: false,
				rollover: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				given: 0,
				type: HoursType.CONFERENCE,
				recurringMonth: 0,
				notRecurring: true,
				recurringForever: false,
				rollover: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		],
		accessCustom: venueData ? venueData.accessCustom : false,
	};

	const {
		handleSubmit,
		setValue,
		control,
		watch,
		getValues,
		setError,
		clearErrors,
		formState: { errors, isDirty },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : initialSpace,
	});

	const { fields: creditHours } = useFieldArray({
		control,
		name: 'creditHours',
	});

	const removePhoto = (id: number) => {
		const newArr = photos.filter((p) => p.id !== id);
		setPhotos(newArr);
	};

	const removeAttachment = (index: number) => {
		const clone = uploadAttachments;
		clone.splice(index, 1);
		setUploadAttachments([...clone]);
	};

	const logoRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const onUploadFile = async (event: any) => {
		setLogoError('');
		try {
			const base64: string = await UploadFileHelper(event);
			setEditingImage(base64);
			setImageEditVisible(true);
		} catch (e) {
			const { message } = e as Error;
			setLogoError(message);
		} finally {
			if (typeof logoRef !== 'undefined' && typeof logoRef.current !== 'undefined') {
				// @ts-ignore
				logoRef.current.value = '';
			}
		}
	};

	const onUploadPicture = (event: any) => onUploadFile(event);

	const handleImageSave = (base64Image: string) => {
		setUploadAttachments([...uploadAttachments, base64Image]);
		setEditingImage('');
		setImageEditVisible(false);
	};

	const handlePhotoPreview = (src: string) => {
		setPhotoPreview(src);
		setPhotoPreviewVisible(true);
	};

	const handleClosePhotoPreview = () => {
		setPhotoPreview('');
		setPhotoPreviewVisible(false);
	};

	const loadAmenities = useCallback(async () => {
		const [list] = await amenityService.list();
		setAmenityList(list);
	}, [amenityList]);

	const loadSpaceAmenities = useCallback(async () => {
		const [list] = await spaceAmenityService.list({ spaceId: initialValues.id });
		setSpaceAmenityList(list);
	}, [spaceAmenityList]);

	const loadSpaceTypes = useCallback(async () => {
		const [spaceTypes] = await spaceTypeService.list({ onlyChildren: true });
		setSpaceTypeList(spaceTypes);
		if (initialValues && initialValues.spaceTypeId) {
			setSelectedSpaceType(spaceTypes.find((st) => st.id === initialValues.spaceTypeId));
		}
	}, [spaceTypeList]);

	const spaceCurrency = typeof venueData?.currency === 'undefined' ? DEFAULT_CURRENCY.code : venueData.currency;

	const roundHours = watch('roundHours');
	const hideQuantity = watch('hideQuantity');
	const quantityRepublish = watch('quantityRepublish');
	const spaceTypeId = watch('spaceTypeId');
	const securityDeposit = watch('securityDeposit');
	const packageShow = watch('packageShow');
	const creditsHalf = watch('creditsHalf');
	const credits2x = watch('credits2x');
	const chargeVariant = watch('chargeVariant');
	const notAllowCredit = watch('notAllowCredit');
	const quantityUnlimited = watch('quantityUnlimited');
	const spaceChargeType = watch('chargeType');

	const getPrivateUrl = () =>
		`${window.location.protocol}//${!brand?.domain || brand?.domain === '' ? '' : `${brand.domain}.`}${APP_DOMAIN}/membership/${spaceId}${
			packageShow === PackageShow.TEAM_MEMBERSHIP
				? `?isTeamLead=true&isFromMembership=${spaceId}`
				: `?simpleMembership=true&isFromMembership=${spaceId}`
		}`;

	const renderAccessBlock = () => {
		if (typeof spaceChargeType === 'undefined' || ![ChargeType.MONTHLY, ChargeType.PRORATE_1, ChargeType.PRORATE].includes(spaceChargeType))
			return <></>;
		return (
			<>
				<Typography id="access" className={classes.tabTitleWrapper}>
					Access
				</Typography>

				<Grid container spacing={3} className={classes.container}>
					<Grid item sm={6} xs={12} className={classes.accessWrap}>
						<Typography variant="subtitle2" className={classes.title}>
							Permissions
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs={12}>
								<SwitchComponent disabled={isReadOnly} control={control} name="access247" label="24/7 Access" />
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12} md={6}>
						{creditHours.map((hour, key: number) => (
							<FormAccessHoursComponent
								key={key}
								setValue={setValue}
								defaultValues={hour}
								watch={watch}
								control={control}
								disabled={isReadOnly}
								index={key}
								isDirty={isDirty}
								setError={setError}
								clearErrors={clearErrors}
								errors={errors}
							/>
						))}
					</Grid>
				</Grid>
			</>
		);
	};

	useEffect(() => {
		if (notAllowCredit) {
			setValue('credits2x', false);
			setValue('creditsHalf', false);
		}
	}, [notAllowCredit]);

	useEffect(() => {
		if (credits2x) {
			setValue('notAllowCredit', false);
			setValue('creditsHalf', false);
		}
	}, [credits2x]);

	useEffect(() => {
		if (creditsHalf) {
			setValue('notAllowCredit', false);
			setValue('credits2x', false);
		}
	}, [creditsHalf]);

	useEffect(() => {
		if (spaceTypeId) {
			setSelectedSpaceType(spaceTypeList.find((st) => st.id === spaceTypeId));
		}
	}, [spaceTypeId]);

	useEffect(() => {
		if (spaceId !== '0' && initialValues && initialValues.venue) {
			setBrand(initialValues.venue.brand);
		}

		loadSpaceTypes().then();
		loadAmenities().then();
		if (initialValues) loadSpaceAmenities().then();
	}, []);

	useEffect(() => {
		const spaceType = spaceTypeList.find((ct) => ct.id === spaceTypeId);
		if (spaceType && ['DropIns', 'Conference'].includes(spaceType.name)) {
			setValue('chargeType', ChargeType.HOURLY, { shouldDirty: true });
			setChargeTypesFilter([ChargeType.HOURLY, ChargeType.FREE]);
		}
		if (spaceType && ['Monthly', 'Recurring'].includes(spaceType.name)) {
			setValue('chargeType', ChargeType.MONTHLY, { shouldDirty: true });
			setChargeTypesFilter([ChargeType.MONTHLY, ChargeType.FREE, ChargeType.PRORATE, ChargeType.PRORATE_1]);
		}
		if (spaceType && !['Monthly', 'Recurring', 'DropIns', 'Conference'].includes(spaceType.name)) {
			setValue('chargeType', ChargeType.HOURLY, { shouldDirty: true });
			setChargeTypesFilter([
				ChargeType.MONTHLY,
				ChargeType.ONE_TIME,
				ChargeType.HOURLY,
				ChargeType.PRORATE,
				ChargeType.PRORATE_1,
				ChargeType.FREE,
			]);
		}
	}, [spaceTypeId]);

	const save = async (formData: SpaceInterface) => {
		try {
			setIsSaving(true);

			const cloneData = formData;
			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			if (!venueIds.length) {
				showSnackBar('Space must have at least one venue!');
				return;
			}

			const spaceType = spaceTypeList.find((ct) => ct.id === formData.spaceTypeId);
			if (typeof spaceType !== 'undefined' && spaceType.logicType === SpaceTypeLogicType.EVENT && typeof formData.eventData !== 'undefined') {
				if (formData.eventData.id === null) {
					/* eslint-disable no-param-reassign */
					formData.eventData.id = undefined;
				}
				cloneData.eventData = {
					...formData.eventData,
					accessHoursFrom: dayjs(formData.eventData.accessHoursFrom as string, timeFormat).format('HH:mm:ss'),
					accessHoursTo: dayjs(formData.eventData.accessHoursTo as string, timeFormat).format('HH:mm:ss'),
					date: formData.eventData.date,
				};
			}

			if (spaceType && spaceType.name !== 'Monthly') cloneData.creditHours = [];

			if (customRepublishMinute || customRepublishHour) cloneData.quantityRepublishCustom = customRepublishHour + customRepublishMinute / 60;

			if (cloneData.accessHoursTo) cloneData.accessHoursTo = dayjs(cloneData.accessHoursTo as string, timeFormat).format('HH:mm:ss');
			if (cloneData.accessHoursFrom) cloneData.accessHoursFrom = dayjs(cloneData.accessHoursFrom as string, timeFormat).format('HH:mm:ss');

			if (cloneData.accessHoursTo === '') cloneData.accessHoursTo = dayjs('16:00:00', 'HH:mm:ss').format('HH:mm:ss');
			if (cloneData.accessHoursFrom === '') cloneData.accessHoursFrom = dayjs('08:00:00', 'HH:mm:ss').format('HH:mm:ss');

			cloneData.photos = photos;
			if (uploadAttachments) {
				cloneData.uploadAttachments = uploadAttachments;
			}

			if (cloneData.quantityUnlimited) {
				cloneData.quantity = 0;
			} else {
				cloneData.quantity = Number(formData.quantity);
			}

			if (cloneData.packageShow && [PackageShow.MEMBERSHIP, PackageShow.TEAM_MEMBERSHIP].includes(cloneData.packageShow)) {
				cloneData.packageSpaceTypes = packageSpaceTypes;
				cloneData.packageBrands = packageBrands;
				cloneData.packageVenueTypes = packageVenueTypes;
				cloneData.packageVenues = packageVenues;
			}

			const priceMatch: any = formData.price ? String(formData.price).match(/[\d.]+/) : null;

			cloneData.capacity = Number(formData.capacity) || Number(initialValues?.capacity);
			cloneData.price = priceMatch ? parseFloat(priceMatch) : 0;
			cloneData.tax = Number(formData.tax);

			cloneData.venueId = Number(venueId);
			cloneData.venueIds = venueIds;

			if (spaceId === '0') {
				cloneData.amenities = spaceAmenityList.map((a) => {
					const { name, chargeType, amenityId, description, id, price, salesTax } = a;
					const returnObj: any = { name, chargeType, amenityId, description, price, salesTax };
					if (typeof id === 'number') returnObj.id = id;
					returnObj.price = Number(returnObj.price);
					returnObj.salesTax = Number(returnObj.salesTax);
					return returnObj;
				});
			} else {
				delete cloneData.amenities;
			}

			const createNewSpaces = async () => {
				const venuesToCreate: number[] = venueIds.filter((v) => v !== Number(venueId));

				if (!venuesToCreate.length) return;

				await Promise.all(
					venuesToCreate.map(async (vId: number) => {
						const spaceData = { ...cloneData, venueId: vId };
						delete spaceData.venueIds;

						if (typeof spaceData.amenities !== 'undefined')
							spaceData.amenities = spaceAmenityList.map((a) => ({ ...a, id: undefined, spaceId: undefined }));

						if (typeof spaceData.creditHours !== 'undefined')
							spaceData.creditHours = spaceData.creditHours.map((a) => ({ ...a, id: undefined }));

						if (typeof spaceData.eventData !== 'undefined')
							spaceData.eventData = { ...spaceData.eventData, id: undefined, spaceId: undefined };

						await spaceService.save(spaceData);
					})
				);
			};

			await spaceService.save(cloneData, itemId);
			await createNewSpaces();
			navigate(`/dashboard/venue/${venueId}#inventory`);
			showSnackBar('Package saved!');
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const getSelectedSpaceTypeName = (name: string) => {
		const type = spaceTypeList.find((ct) => ct.name === name && ct.id === spaceTypeId);
		return typeof type !== 'undefined';
	};

	const minuteSelect = (event: SelectChangeEvent) => {
		const val = Number(event.target.value);
		setCustomRepublishMinute(val);
		setValue('quantityRepublishCustom', customRepublishHour + val / 60);
	};
	const hourSelect = (event: SelectChangeEvent) => {
		const val = Number(event.target.value);
		setCustomRepublishHour(val);
		setValue('quantityRepublishCustom', val + customRepublishMinute / 60);
	};

	const handleDelete = async () => {
		if (!spaceId) return;
		setIsSaving(true);
		setConfirmDialogVisible(false);
		try {
			await spaceService.delete(spaceId);
			navigate(`/dashboard/venue/${venueId}#inventory`);
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const createStickyStyles = (style: any) => ({ ...style, top: 70, backgroundColor: 'white', zIndex: 1 });

	return (
		<>
			<form onSubmit={handleSubmit((d) => save(d as SpaceInterface))} className={classes.root}>
				<Paper>
					<StickyContainer>
						<Sticky disableCompensation>
							{({ style }) => (
								<Grid container spacing={0} style={createStickyStyles(style)}>
									<Grid item xs={12} className={classes.topTitle}>
										<StickyContainer>
											<Tabs
												value={activeTab}
												indicatorColor="primary"
												textColor="primary"
												onChange={changeTab}
												orientation={isMobile ? 'vertical' : 'horizontal'}
											>
												<Tab
													label="Basic information"
													value="info"
													offset="200"
													href="#info"
													component={AnchorLinkComponent}
													className={classes.topTab}
												/>
												{selectedSpaceType && selectedSpaceType.logicType !== SpaceTypeLogicType.INFO && (
													<Tab
														label="Billing"
														value="billing"
														href="#billing"
														offset="200"
														component={AnchorLinkComponent}
														className={classes.topTab}
													/>
												)}
												{spaceChargeType &&
													[ChargeType.MONTHLY, ChargeType.PRORATE_1, ChargeType.PRORATE].includes(spaceChargeType) && (
														<Tab
															label="Access"
															value="access"
															href="#access"
															offset="200"
															component={AnchorLinkComponent}
															className={classes.topTab}
														/>
													)}
												<Tab
													label="Amenities"
													value="amenities"
													href="#amenities"
													offset="200"
													component={AnchorLinkComponent}
													className={classes.topTab}
												/>
												<Tab
													label="Visibility"
													value="visibility"
													href="#visibility"
													offset="200"
													component={AnchorLinkComponent}
													className={classes.topTab}
												/>
											</Tabs>
										</StickyContainer>
									</Grid>
								</Grid>
							)}
						</Sticky>

						<Grid container spacing={0}>
							<Grid item xs={12} className={classes.backContainer}>
								<Button
									className={classes.backLink}
									onClick={() => navigate(`/dashboard/venue/${venueId}#inventory`)}
									startIcon={<ChevronLeftIcon className={classes.backIcon} />}
								>
									<Typography>Back to venue</Typography>
								</Button>
							</Grid>
						</Grid>

						<div id="info">
							<Waypoint onEnter={() => setActiveTab('info')} />
							<Typography className={classes.tabTitleWrapper}>Basic Information</Typography>

							<Grid container spacing={3} className={classes.container}>
								<Grid item xs={12} md={7}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												disabled={isReadOnly}
												fullWidth
												error={!!errors.name}
												helperText={errors.name ? errors.name.message : ''}
												label="Package Name"
												InputLabelProps={{ shrink: true }}
												variant="outlined"
											/>
										)}
										rules={{ required: 'Field is required' }}
										name="name"
										control={control}
									/>
								</Grid>

								<Grid item xs={12} md={5}>
									<SelectSpaceTypeComponent disabled={isReadOnly || !!initialValues} control={control} required />
								</Grid>

								<Grid item xs={12} md={7}>
									<Controller
										rules={{ required: false }}
										render={({ field }) => (
											<TextField
												{...field}
												disabled={isReadOnly}
												fullWidth
												error={!!errors.description}
												multiline
												label="Package Description"
												helperText={errors.description ? errors.description.message : ''}
												minRows={4}
												InputLabelProps={{ shrink: true }}
												variant="outlined"
											/>
										)}
										name="description"
										control={control}
									/>

									{getSelectedSpaceTypeName('Events') && (
										<Grid container spacing={3} style={{ marginTop: 35 }}>
											<Grid item>
												<Controller
													render={({ field }) => <Input className={classes.hiddenField} {...field} type="hidden" />}
													name="eventData.id"
													control={control}
												/>
												<Controller
													render={({ field }) => <Input className={classes.hiddenField} {...field} type="hidden" />}
													name="eventData.spaceId"
													control={control}
												/>

												<Controller
													render={({ field: thisField }) => (
														<DatePicker
															{...thisField}
															disabled={isReadOnly}
															className={classes.timeField}
															renderInput={(props) => <TextField {...props} variant="outlined" label="Event date" />}
														/>
													)}
													name="eventData.date"
													control={control}
													defaultValue={
														initialValues && initialValues.eventData ? initialValues.eventData.date : new Date()
													}
												/>
											</Grid>
											<Grid item>
												<Controller
													render={({ field }) => (
														<TimePicker
															{...field}
															className={classes.timeField}
															inputFormat={timeFormat}
															disabled={isReadOnly}
															renderInput={(props) => (
																<TextField
																	{...props}
																	InputLabelProps={{ shrink: true }}
																	variant="outlined"
																	label="Event start time"
																/>
															)}
														/>
													)}
													name="eventData.accessHoursFrom"
													control={control}
													defaultValue={
														initialValues && initialValues.eventData
															? dayjs(initialValues.eventData.accessHoursFrom as string, 'HH:mm:ss').format('HH:mm')
															: dayjs('08:00', 'HH:mm:ss')
													}
												/>
											</Grid>
											<Grid item> - </Grid>
											<Grid item>
												<Controller
													render={({ field }) => (
														<TimePicker
															{...field}
															className={classes.timeField}
															inputFormat={timeFormat}
															disabled={isReadOnly}
															renderInput={(props) => (
																<TextField
																	{...props}
																	variant="outlined"
																	label="Event start time"
																	InputLabelProps={{ shrink: true }}
																/>
															)}
														/>
													)}
													name="eventData.accessHoursTo"
													control={control}
													defaultValue={
														initialValues && initialValues.eventData
															? dayjs(initialValues.eventData.accessHoursTo as string, 'HH:mm:ss').format('HH:mm')
															: dayjs('18:00', 'HH:mm:ss')
													}
												/>
											</Grid>
										</Grid>
									)}
								</Grid>

								{selectedSpaceType && selectedSpaceType.logicType !== SpaceTypeLogicType.INFO && (
									<Grid item xs={12} md={5}>
										<Grid container spacing={3}>
											<Grid item xs={6}>
												<Controller
													render={({ field }) => (
														<TextField
															error={!!errors.quantity}
															variant="outlined"
															{...field}
															InputLabelProps={{ shrink: true }}
															label="Quantity"
															disabled={!!quantityUnlimited || isReadOnly}
															helperText={errors.quantity ? errors.quantity.message : ''}
														/>
													)}
													rules={{
														required: !quantityUnlimited,
													}}
													name="quantity"
													control={control}
												/>
											</Grid>
											<Grid item xs={6}>
												<Controller
													render={({ field }) => (
														<TextField
															{...field}
															error={!!errors.capacity}
															disabled={isReadOnly}
															InputProps={{
																readOnly: hideQuantity,
															}}
															helperText={errors.capacity ? errors.capacity.message : ''}
															InputLabelProps={{ shrink: true }}
															label="Capacity"
															variant="outlined"
															className={hideQuantity ? classes.fieldDisabled : ''}
														/>
													)}
													rules={{
														required: 'Field is required',
													}}
													name="capacity"
													control={control}
												/>
											</Grid>

											<Grid item xs={5}>
												<CheckboxComponent
													disabled={isReadOnly}
													control={control}
													name="quantityUnlimited"
													label="Unlimited"
												/>
											</Grid>
											<Grid item xs={7}>
												<CheckboxComponent
													disabled={isReadOnly}
													control={control}
													name="hideQuantity"
													label="Hide Seats Available"
												/>
											</Grid>

											{!quantityUnlimited && initialValues && (
												<>
													<Grid item xs={12}>
														<Controller
															render={({ field }) => (
																<TextField
																	{...field}
																	disabled={isReadOnly}
																	InputProps={{
																		readOnly: true,
																	}}
																	InputLabelProps={{ shrink: true }}
																	label="Used Quantity"
																	variant="outlined"
																	className={hideQuantity ? classes.fieldDisabled : ''}
																/>
															)}
															name="usedQuantity"
															control={control}
														/>
													</Grid>
													{/* <Grid item xs={12}> */}
													{/*	<Box display="flex" alignItems="center" flexDirection="column"> */}
													{/*		<Box width="100%"> */}
													{/*			<Typography style={{ textAlign: 'center' }}> */}
													{/*				Used quantity: {initialValues.usedQuantity} */}
													{/*				<br /> */}
													{/*			</Typography> */}
													{/*		</Box> */}
													{/*		<Box width="100%"> */}
													{/*			<LinearProgress */}
													{/*				variant="determinate" */}
													{/*				value={(100 * (initialValues.usedQuantity || 0)) / (initialValues.quantity || 0)} */}
													{/*			/> */}
													{/*		</Box> */}
													{/*		<Box width="100%"> */}
													{/*			<Divider style={{ width: '100%' }} /> */}
													{/*		</Box> */}
													{/*	</Box> */}
													{/* </Grid> */}
													{/* <Divider style={{ width: '100%' }} /> */}
												</>
											)}

											{!quantityUnlimited && (
												<Grid item xs={12}>
													<FormControl fullWidth>
														<InputLabel shrink id="quantityRepublish">
															Republish Interval
														</InputLabel>
														<Controller
															name="quantityRepublish"
															control={control}
															render={({ field }) => (
																<Select
																	{...field}
																	disabled={isReadOnly}
																	id="quantityRepublish_"
																	labelId="quantityRepublish"
																	placeholder="Please select"
																	variant="outlined"
																>
																	<MenuItem value={0}>None</MenuItem>
																	<MenuItem value={12}>Every 12 hours</MenuItem>
																	<MenuItem value={24}>Every 24 hours</MenuItem>
																	<MenuItem value={777}>Custom</MenuItem>
																</Select>
															)}
														/>
													</FormControl>
												</Grid>
											)}

											{!quantityUnlimited && quantityRepublish === 777 && (
												<Grid item xs={12}>
													<InputLabel shrink id="quantityRepublish">
														Custom Republish Interval
													</InputLabel>

													<Select className={classes.timeDrop} onChange={hourSelect} value={String(customRepublishHour)}>
														{[...Array(12).keys()].map((n) => (
															<MenuItem value={n} key={n}>
																{n >= 10 ? n : `0${n}`}
															</MenuItem>
														))}
													</Select>
													<span style={{ position: 'relative', top: -10, paddingLeft: 15, paddingRight: 10 }}>:</span>
													<Select
														className={classes.timeDrop}
														onChange={minuteSelect}
														value={String(customRepublishMinute)}
													>
														<MenuItem value={0}>00</MenuItem>
														<MenuItem value={15}>15</MenuItem>
														<MenuItem value={30}>30</MenuItem>
														<MenuItem value={45}>45</MenuItem>
													</Select>
												</Grid>
											)}
										</Grid>
									</Grid>
								)}
								<Grid item xs={12}>
									<InputLabel shrink htmlFor="">
										Space photos
									</InputLabel>
								</Grid>

								<Grid item xs={12} className={classes.photosWrap}>
									{photos.map((p: any) => (
										<div className={classes.avatarSquare} key={p.id}>
											<Avatar
												variant="square"
												onClick={() => handlePhotoPreview(`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${p.url}`)}
												src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${p.url}`}
											>
												N
											</Avatar>
											{!isReadOnly && (
												<IconButton
													color="primary"
													aria-label="upload picture"
													component="span"
													className={classes.photosClose}
													onClick={() => removePhoto(p.id)}
													size="large"
												>
													<CancelIcon />
												</IconButton>
											)}
										</div>
									))}

									{uploadAttachments.map((p: any, i: number) => (
										<div className={classes.avatarSquare} key={i}>
											<Avatar variant="square" onClick={() => handlePhotoPreview(p)} src={p}>
												N
											</Avatar>
											{!isReadOnly && (
												<IconButton
													color="primary"
													aria-label="upload picture"
													component="span"
													className={classes.photosClose}
													onClick={() => {
														removeAttachment(i);
													}}
													size="large"
												>
													<CancelIcon />
												</IconButton>
											)}
										</div>
									))}

									{!isReadOnly && (
										<>
											<label htmlFor="new-item-pic" style={{ display: 'flex' }}>
												<IconButton className={classes.avatarSquare} component="span" size="large">
													<>
														<AddIcon />
														<Typography>Add photo</Typography>
													</>
												</IconButton>
											</label>
											<input
												accept="image/*"
												className={classes.uploadInput}
												id="new-item-pic"
												ref={logoRef}
												type="file"
												onChange={onUploadPicture}
											/>
										</>
									)}
								</Grid>

								{logoError !== '' && (
									<Grid item xs={12}>
										<FormHelperText error className={classes.imageErrorText}>
											{logoError}
										</FormHelperText>
									</Grid>
								)}
							</Grid>
						</div>

						{selectedSpaceType && selectedSpaceType.logicType !== SpaceTypeLogicType.INFO && (
							<div id="billing">
								<Waypoint onEnter={() => setActiveTab('billing')} />
								<Typography className={classes.tabTitleWrapper}>Billing</Typography>

								<Grid container spacing={3} className={classes.container}>
									<Grid item xs={12} md={6}>
										<Grid container spacing={3}>
											<Grid item xs={6}>
												<SelectChargeTypeComponent
													control={control}
													disabled={isReadOnly}
													required
													error={errors.chargeType}
													helperText={errors.chargeType ? 'Field is required' : ''}
													filter={{
														names: chargeTypesFilter,
													}}
												/>
											</Grid>

											{typeof spaceChargeType !== 'undefined' && ![ChargeType.FREE].includes(spaceChargeType) && (
												<Grid item xs={6}>
													<Grid container>
														<Grid item xs={6}>
															<Controller
																rules={{ required: 'Field is required' }}
																render={({ field }) => (
																	<NumberFormat
																		{...field}
																		customInput={TextField}
																		fullWidth
																		error={!!errors.price}
																		disabled={isReadOnly}
																		helperText={errors.price ? errors.price.message : ''}
																		decimalScale={2}
																		allowNegative={false}
																		allowLeadingZeros={true}
																		fixedDecimalScale={true}
																		variant="outlined"
																		label="Price"
																		prefix={decodeHTMLContent(getCurrencySymbol(spaceCurrency))}
																	/>
																)}
																name="price"
																control={control}
															/>
														</Grid>
														<Grid item xs={6}>
															<Controller
																rules={{ required: 'Field is required' }}
																render={({ field }) => (
																	<TextField
																		{...field}
																		fullWidth
																		variant="outlined"
																		label="Tax"
																		disabled={isReadOnly}
																		error={!!errors.tax}
																		helperText={errors.tax ? errors.tax.message : ''}
																		InputProps={{
																			endAdornment: <InputAdornment position="end">%</InputAdornment>,
																		}}
																	/>
																)}
																name="tax"
																control={control}
															/>
														</Grid>
													</Grid>
												</Grid>
											)}

											{spaceChargeType === ChargeType.HOURLY && (
												<>
													<Grid item xs={6}>
														<SelectRoundHoursComponent disabled={isReadOnly} control={control} />
													</Grid>
													{selectedSpaceType && selectedSpaceType.logicType === SpaceTypeLogicType.MINUTELY && (
														<Grid item xs={6}>
															<SelectRoundHoursComponent
																label="Custom additional time"
																name="customAdditionalTime"
																disabled={
																	isReadOnly ||
																	roundHours === 0 ||
																	chargeVariant !== ChargeVariant.byCustomAdditionalHours
																}
																control={control}
															/>
														</Grid>
													)}
												</>
											)}

											<ChargeVariantBlock
												isReadOnly={isReadOnly}
												control={control}
												spaceChargeType={spaceChargeType}
												roundHours={roundHours}
												selectedSpaceType={selectedSpaceType}
											/>
										</Grid>
									</Grid>
									<Grid item xs={12} md={6}>
										{spaceChargeType === ChargeType.HOURLY && (
											<Grid container spacing={3}>
												<Grid item xs={12} md={7}>
													<CheckboxComponent
														disabled={isReadOnly}
														control={control}
														name="notAllowCredit"
														label="Credits can’t be applied"
													/>
												</Grid>

												<Grid item xs={12} md={5}>
													<CheckboxComponent
														disabled={isReadOnly}
														control={control}
														name="credits2x"
														label="Use 2x Credits"
													/>
												</Grid>

												<Grid item xs={12} md={5}>
													<CheckboxComponent
														disabled={isReadOnly}
														control={control}
														name="creditsHalf"
														label="Use 1/2x Credits"
													/>
												</Grid>
											</Grid>
										)}
									</Grid>
								</Grid>

								<Grid container spacing={3} className={classes.container}>
									<Grid item xs={12} md={6}>
										<Grid container spacing={3}>
											{(spaceChargeType === ChargeType.PRORATE || spaceChargeType === ChargeType.PRORATE_1) && (
												<>
													<Grid item xs={12} md={6}>
														<FormControl className={classes.formControl} error={!!errors.billCycleStart}>
															<InputLabel htmlFor="grouped-native-select">Bill Cycle Date</InputLabel>

															<Controller
																name="billCycleStart"
																control={control}
																rules={{
																	required: 'Field is required',
																}}
																render={({ field }) => (
																	<Select {...field} id="billCycleStart">
																		{[...Array(31).keys()].map((k) => (
																			<MenuItem value={k + 1} key={k}>
																				{k + 1}
																			</MenuItem>
																		))}
																	</Select>
																)}
															/>
															{errors.billCycleStart && (
																<FormHelperText error>{errors.billCycleStart.message}</FormHelperText>
															)}
														</FormControl>
													</Grid>
												</>
											)}

											<Grid item xs={12} md={6}>
												<FormControl fullWidth>
													<InputLabel shrink>Add security deposit</InputLabel>
													<Typography component="div" style={{ marginTop: 15 }}>
														<Grid component="label" container alignItems="center" spacing={1}>
															<Grid item>No</Grid>
															<Grid item>
																<Controller
																	control={control}
																	name="securityDeposit"
																	render={({ field }) => (
																		<Switch {...field} disabled={isReadOnly} color="primary" />
																	)}
																/>
															</Grid>
															<Grid item>Yes</Grid>
														</Grid>
													</Typography>
												</FormControl>
											</Grid>

											{securityDeposit && (
												<Grid item xs={12} md={6}>
													<Controller
														rules={{ required: 'Field is required' }}
														render={({ field }) => (
															<TextField
																{...field}
																variant="outlined"
																fullWidth
																label="Deposit amount"
																error={!!errors.securityDepositPrice}
																helperText={errors.securityDepositPrice ? errors.securityDepositPrice.message : ''}
																InputProps={{
																	startAdornment: <InputAdornment position="start" />,
																}}
																disabled={isReadOnly}
															/>
														)}
														name="securityDepositPrice"
														control={control}
													/>
												</Grid>
											)}

											{isSuperAdmin && initialValues?.stripeData && (
												<Grid item xs={12} md={12}>
													<Typography>Stripe data</Typography>
													{initialValues?.stripeData.map((prod, i) => (
														<div key={i}>
															<Link
																key={i}
																href={`https://dashboard.stripe.com/${
																	NODE_ENV !== 'production' ? 'test/' : ''
																}products/${prod.id}`}
															>
																{prod.name}
															</Link>
															<br />
														</div>
													))}
												</Grid>
											)}
										</Grid>
									</Grid>
								</Grid>
							</div>
						)}

						<Waypoint onEnter={() => setActiveTab('access')} />
						<div id="access">{renderAccessBlock()}</div>

						<Waypoint onEnter={() => setActiveTab('amenities')} />

						<SpaceAmenityBlockComponent
							isReadOnly={isReadOnly}
							isNewSpace={spaceId === '0'}
							spaceChargeType={spaceChargeType}
							venueData={venueData}
							fields={spaceAmenityList}
							spaceId={Number(spaceId)}
							doReload={(items) => setSpaceAmenityList(items)}
						/>

						<Waypoint onEnter={() => setActiveTab('visibility')} />
						<div id="visibility">
							<Typography className={classes.tabTitleWrapper}>Visibility</Typography>

							<Grid container spacing={3} className={classes.container}>
								<Grid item xs={12} md={6}>
									<FormControl className={classes.formControl}>
										<InputLabel id="select-package-show-label" shrink>
											Make this visible to:
										</InputLabel>
										<Controller
											render={({ field }) => (
												<Select
													{...field}
													variant="outlined"
													labelId="select-package-show-label"
													placeholder="Please select"
													disabled={isReadOnly}
													error={!!errors.packageShow}
												>
													{packageShowItems.map((i: PackageShow) => (
														<MenuItem value={i} key={i}>
															{i}
														</MenuItem>
													))}
												</Select>
											)}
											defaultValue={PackageShow.PUBLIC}
											name="packageShow"
											control={control}
											rules={{ required: 'Field is required' }}
										/>
										{errors.packageShow && (
											<Grid item xs={12}>
												<FormHelperText error className={classes.imageErrorText}>
													{errors.packageShow.message}
												</FormHelperText>
											</Grid>
										)}
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<SelectPackageStatusComponent
										hideDeleted={initialValues?.status !== SpaceStatus.DELETED}
										disabled={isReadOnly}
										control={control}
									/>
								</Grid>

								{packageShow && [PackageShow.MEMBERSHIP, PackageShow.TEAM_MEMBERSHIP].includes(packageShow) && spaceId !== '0' && (
									<Grid item xs={12}>
										<FormControl fullWidth>
											<TextField
												disabled
												value={getPrivateUrl()}
												InputProps={{
													endAdornment: (
														<InputAdornment position="start">
															<CopyToClipboard text={getPrivateUrl()} onCopy={() => setUrlCopied(true)}>
																<Button>Copy</Button>
															</CopyToClipboard>
														</InputAdornment>
													),
												}}
											/>
											{urlCopied && <FormHelperText>Link copied.</FormHelperText>}
										</FormControl>
									</Grid>
								)}

								{packageShow && [PackageShow.MEMBERSHIP, PackageShow.TEAM_MEMBERSHIP].includes(packageShow) && (
									<>
										{isSuperAdmin && (
											<BrandChipsBlock
												onChange={setPackageBrands}
												initialValues={initialValues && initialValues.packageBrands ? initialValues.packageBrands : []}
											/>
										)}

										<VenueTypeChipsBlock
											onChange={setPackageVenueTypes}
											isReadOnly={isReadOnly}
											initialValues={initialValues && initialValues.packageVenueTypes ? initialValues.packageVenueTypes : []}
										/>

										<VenueChipsBlock
											onChange={setPackageVenues}
											isReadOnly={isReadOnly}
											filter={{
												brandIds: packageBrands.map((pb) => Number(pb.id)),
												venueTypeIds: packageVenueTypes.map(({ id }) => Number(id)),
											}}
											brandId={isSuperAdmin ? undefined : authBody?.brandId}
											initialValues={initialValues && initialValues.packageVenues ? initialValues.packageVenues : []}
										/>

										<PackageTypeVisibilityBlock
											isReadOnly={isReadOnly}
											onSpaceTypesChange={setPackageSpaceTypes}
											initialPackagesList={
												initialValues && initialValues.packageSpaceTypes ? initialValues.packageSpaceTypes : []
											}
										/>
									</>
								)}
							</Grid>
						</div>
					</StickyContainer>

					{Object.keys(errors).length > 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Divider />
								<Typography className={classes.errorText}>You have errors in form. Please fill in all required fields.</Typography>
								<Divider />
							</Grid>
						</Grid>
					)}

					<Grid container spacing={3} className={classes.bottomWrap}>
						<Grid item xs={12} className={classes.bottomWrap}>
							<Button
								variant="contained"
								color="secondary"
								type="button"
								size="large"
								style={{ marginTop: 15, marginRight: 15 }}
								onClick={() => navigate(`/dashboard/venue/${venueId}#inventory`)}
							>
								Cancel
							</Button>

							{typeof initialValues !== 'undefined' && initialValues.id && !isReadOnly && (
								<Button
									variant="outlined"
									color="secondary"
									size="large"
									onClick={() => setConfirmDialogVisible(true)}
									style={{ marginTop: 15, marginRight: 15 }}
								>
									Delete package
								</Button>
							)}

							<Button variant="contained" color="primary" type="submit" size="large" style={{ marginTop: 15 }} disabled={isReadOnly}>
								Save package
							</Button>
						</Grid>
					</Grid>

					<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
						<CircularProgress color="inherit" />
					</Backdrop>
					<br />
				</Paper>
			</form>

			<Dialog onClose={() => setImageEditVisible(false)} open={imageEditVisible}>
				<ImageEditor image={editingImage} aspectRatio={16 / 9} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>

			<Dialog onClose={handleClosePhotoPreview} open={photoPreviewVisible}>
				<img src={photoPreview} alt="" style={{ width: '100%' }} />
				<DialogActions>
					<Button onClick={handleClosePhotoPreview} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<ConfirmDialog
				text={`Are you sure you want to delete ${getValues('name')}?`}
				open={confirmDialogVisible}
				onClose={() => setConfirmDialogVisible(false)}
				action={handleDelete}
			/>
		</>
	);
}

export default memo(FormSpaceComponent);
