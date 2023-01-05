import React, { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as EmailValidator from 'email-validator';
import Button from '@mui/material/Button';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import CancelIcon from '@mui/icons-material/Cancel';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import GoogleMapReact from 'google-map-react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';
import FileInterface from 'dd-common-blocks/dist/interface/file.interface';
import SelectVenueStatusComponent from '@forms/elements/select-venue-status.component';
import VenueService from '@service/venue.service';
import AddressSelectComponent from '@forms/elements/address-select.component';
import { GeolocationData } from '@helpers/geolocate.helper';
import ImageEditor from '@shared-components/image-editor.component';
import { AuthContext } from '@context/auth.context';
import countryCurrency from 'dd-common-blocks/libs/country-currency.json';
import { DEFAULT_CURRENCY } from '@core/config';
import { SnackBarContext } from '@context/snack-bar.context';
import SelectTimeZoneComponent from '@forms/elements/select-time-zone.component';
import SelectCurrencyComponent from '@forms/elements/select-currency.component';
import WeekdaySorterHelper from '@helpers/weekday.sort.helper';
import UploadFileHelper from '@helpers/file-upload.helper';
import CheckboxComponent from '@forms/elements/checkbox.component';
import { MarkerSimple } from '@shared-components/google-maps.component';
import ConfirmDialog from '@shared-components/confirm.dialog';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import VenueFormValuesInterface from '@forms/interface/venue-form-values.interface';
import VenueTypeFilter from 'dd-common-blocks/dist/interface/filter/venue-type-filter.interface';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';
import PhoneInputComponent from '@forms/elements/phone-input.component';
import AccessHFormValues from '@forms/interface/access-h-form-values.interface';
import AccessTimeRowComponent from '../access-time-row.component';
import FormVenueStyles from './styles/form-venue.styles';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);
extend(localeData);

const VENUE_DEFAULT: VenueFormValuesInterface = {
	currency: 'USD',
	tzId: 'America/New_York',
	tzOffset: -500,
	address: '',
	address2: '',
	showOnMap: true,
	name: '',
	accessCustom: false,
	accessHoursFrom: dayjs('8:00:00', 'HH:mm:ss'),
	accessHoursTo: dayjs('16:00:00', 'HH:mm:ss'),
	accessCustomData: dayjs.weekdays().map((weekday: string) => ({
		open: true,
		weekday,
		accessHoursFrom: dayjs('8:00:00', 'HH:mm:ss'),
		accessHoursTo: dayjs('16:00:00', 'HH:mm:ss'),
	})),
	status: VenueStatus.PUBLISH,
	alias: '',
	description: '',
	city: '',
	state: '',
	phone: '',
	accessOpen: false,
	brandId: '',
	venueTypeId: '',
	country: '',
	countryCode: 'US',
	coordinates: { type: '', coordinates: [0, 0] },
};

export default function FormVenueComponent({
	initialValues,
	onSave,
	onDelete,
}: {
	initialValues?: VenueFormValuesInterface;
	onSave: () => any;
	onDelete?: () => any;
}) {
	const classes = FormVenueStyles({});
	const venueService = new VenueService();

	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const [coordinates, setCoordinates] = useState<number[]>(
		initialValues && initialValues.coordinates ? initialValues.coordinates.coordinates : [Number(0), Number(0)]
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);

	const [logo, setLogo] = useState<string>(
		initialValues && initialValues.logo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${initialValues.logo.url}` : ''
	);

	const [photos, setPhotos] = useState<FileInterface[]>(initialValues && initialValues.photos ? initialValues.photos : []);
	const [uploadAttachments, setUploadAttachments] = useState<string[]>([]);
	const [uploadLogo, setUploadLogo] = useState<string>();

	const [photoPreview, setPhotoPreview] = useState<string>('');
	const [photoPreviewVisible, setPhotoPreviewVisible] = useState<boolean>(false);

	const [editingImageType, setEditingImageType] = useState<'logo' | 'pic'>('logo');
	const [editingImage, setEditingImage] = useState<string>('');

	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);
	const [picError, setPicError] = useState<string>('');
	const [logoError, setLogoError] = useState<string>('');

	const picRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const logoRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const isReadOnly = initialValues && initialValues.status === VenueStatus.DELETED;

	if (!isSuperAdmin && !initialValues && authBody) {
		VENUE_DEFAULT.brandId = authBody.brandId;
	}

	if (initialValues && initialValues.accessCustomData) {
		// eslint-disable-next-line no-param-reassign
		initialValues.accessCustomData = initialValues.accessCustomData.map((item) => {
			const clone = item;
			clone.accessHoursTo = dayjs(item.accessHoursTo as string, 'HH:mm:ss');
			clone.accessHoursFrom = dayjs(item.accessHoursFrom as string, 'HH:mm:ss');
			return clone;
		});

		initialValues.accessCustomData.sort(WeekdaySorterHelper);
	}

	if (initialValues && initialValues.accessHoursFrom) {
		// eslint-disable-next-line no-param-reassign
		initialValues.accessHoursFrom = dayjs(initialValues.accessHoursFrom as string, 'HH:mm:ss');
	}

	if (initialValues && initialValues.accessHoursTo) {
		// eslint-disable-next-line no-param-reassign
		initialValues.accessHoursTo = dayjs(initialValues.accessHoursTo as string, 'HH:mm:ss');
	}

	// @ts-ignore
	if (initialValues && initialValues.brand) {
		// @ts-ignore
		initialValues.brand = undefined;
	}

	if (initialValues && initialValues.address) {
		// eslint-disable-next-line no-param-reassign
		initialValues.addressObject = {
			address: initialValues.address,
			description: initialValues.address,
			country: initialValues.country,
			city: initialValues.city,
			state: initialValues.state,
			latitude: initialValues.coordinates.coordinates[1],
			longitude: initialValues.coordinates.coordinates[0],
		};
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setError,
		clearErrors,
		control,
		watch,
		getValues,
		reset,
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : VENUE_DEFAULT,
	});

	const { fields: accessCustomData } = useFieldArray({
		control,
		name: 'accessCustomData',
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

	const addressObject = watch('addressObject');
	const accessCustom = watch('accessCustom');

	const setImageError = (text: string, type: 'logo' | 'pic') => {
		if (type === 'logo') setLogoError(text);
		if (type === 'pic') setPicError(text);
	};

	const clearImageError = (type: 'logo' | 'pic') => {
		if (type === 'logo') setLogoError('');
		if (type === 'pic') setPicError('');
	};

	const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'pic') => {
		clearImageError(type);
		try {
			const base64: string = await UploadFileHelper(event);
			setEditingImageType(type);
			setEditingImage(base64);
			setImageEditVisible(true);
		} catch (e) {
			const { message } = e as Error;
			setImageError(message, type);
		} finally {
			if (typeof picRef !== 'undefined' && typeof picRef.current !== 'undefined') {
				// @ts-ignore TODO
				picRef.current.value = '';
			}
			if (typeof logoRef !== 'undefined' && typeof logoRef.current !== 'undefined') {
				// @ts-ignore TODO
				logoRef.current.value = '';
			}
		}
	};

	const onUploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => onUploadFile(event, 'logo');

	const onUploadPicture = (event: React.ChangeEvent<HTMLInputElement>) => onUploadFile(event, 'pic');

	const handleImageSave = (base64Image: string) => {
		if (editingImageType === 'logo') {
			setLogo(base64Image);
			setUploadLogo(base64Image);
		} else {
			setUploadAttachments([...uploadAttachments, base64Image]);
		}
		setEditingImage('');
		setImageEditVisible(false);
	};

	useEffect(() => {
		if (addressObject && addressObject.countryCode) {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { countryCode, timezone, utc_offset, country, state, city, latitude, longitude, address } =
				addressObject as unknown as GeolocationData;
			if (timezone) setValue('tzId', timezone);
			if (utc_offset) setValue('tzOffset', utc_offset);
			if (countryCode) setValue('countryCode', countryCode);
			setValue('country', country);
			if (state) setValue('state', state);
			if (address) setValue('address', address);
			if (city) setValue('city', city);
			// @ts-ignore
			setValue('currency', countryCode && countryCurrency[countryCode] ? countryCurrency[countryCode] : DEFAULT_CURRENCY.code);

			if ([longitude, latitude].toString() !== coordinates.toString()) {
				setCoordinates([longitude, latitude]);
			}
		}
	}, [addressObject]);

	useEffect(() => {
		if (accessCustom && !accessCustomData.length) {
			// appendAccessData
			reset({
				...getValues(),
				accessCustomData: dayjs.weekdays().map((weekday: string) => ({
					open: true,
					weekday,
					accessHoursFrom: dayjs('8:00:00', 'HH:mm:ss'),
					accessHoursTo: dayjs('16:00:00', 'HH:mm:ss'),
				})),
			});
		}
	}, [accessCustom]);

	const handleEmailValidation = async (email: any) => {
		const isValidSyntax = EmailValidator.validate(email);
		if (!isValidSyntax) return 'Email format is wrong';
		return true;
	};

	const handleDelete = async () => {
		setConfirmDialogVisible(false);

		setIsLoading(true);

		try {
			if (typeof initialValues !== 'undefined' && typeof initialValues.id !== 'undefined') {
				await venueService.delete(initialValues.id);
				if (onDelete) onDelete();
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsLoading(false);
		}
	};

	const save = async (formData: VenueFormValuesInterface) => {
		setIsLoading(true);
		try {
			if (formData.id && formData.status === VenueStatus.DELETED) return await venueService.delete(formData.id);

			const cloneData = formData;
			cloneData.accessHoursTo = dayjs(String(cloneData.accessHoursTo)).second(0).format('HH:mm:ss');
			cloneData.accessHoursFrom = dayjs(String(cloneData.accessHoursFrom)).second(0).format('HH:mm:ss');

			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			if (initialValues && initialValues.photos && initialValues.photos.length === 0 && uploadAttachments.length === 0) {
				showSnackBar('Venue must have at least one photo!');
				return;
			}

			if (
				(typeof initialValues !== 'undefined' && typeof initialValues.photos !== 'undefined' ? initialValues.photos.length : 0) +
					(uploadAttachments ? uploadAttachments.length : 0) <
				1
			) {
				showSnackBar('Venue must have at least one photo!');
				return;
			}

			if (formData.accessCustomData) {
				cloneData.accessCustomData = formData.accessCustomData.map((acd: AccessHFormValues) => {
					const clone = acd;
					clone.accessHoursTo = dayjs(String(acd.accessHoursTo)).second(0).format('HH:mm:ss');
					clone.accessHoursFrom = dayjs(String(acd.accessHoursFrom)).second(0).format('HH:mm:ss');
					return clone;
				});
			}

			cloneData.photos = photos;

			if (uploadLogo) {
				cloneData.uploadLogo = uploadLogo;
			}

			if (uploadAttachments) {
				cloneData.uploadAttachments = uploadAttachments;
			}

			if (cloneData.logo) delete cloneData.logo;

			cloneData.updatedById = authBody?.id;
			cloneData.address = formData.address;
			cloneData.address2 = formData.address2;
			cloneData.showOnMap = formData.showOnMap;
			cloneData.phone = formData.phone;
			cloneData.tzOffset = Number(formData.tzOffset);

			cloneData.coordinates = { type: 'Point', coordinates };

			const savedVenue = await venueService.save(cloneData, itemId);
			if (!itemId) {
				window.location.href = `/dashboard/venue/${savedVenue.id}`;
			}
			showSnackBar('Venue saved!');

			onSave();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePhotoPreview = (src: string) => {
		setPhotoPreview(src);
		setPhotoPreviewVisible(true);
	};

	const handleClosePhotoPreview = () => {
		setPhotoPreview('');
		setPhotoPreviewVisible(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit(save)} className={classes.root}>
				<Paper>
					<Typography className={classes.tabTitleWrapper}>Basic Venue Information</Typography>

					<Grid container spacing={3} className={classes.container}>
						<Grid item xs={12} md={8}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.name}
												fullWidth
												helperText={errors.name ? errors.name.message : ''}
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												label="Building Name"
												disabled={isReadOnly}
											/>
										)}
										rules={{ required: 'Field is required' }}
										name="name"
										control={control}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										render={({ field }) => (
											<AddressSelectComponent
												{...field}
												error={!!errors.address}
												disabled={isReadOnly}
												label="Building Address"
												helperText={errors.address ? String(errors.address.message) : ''}
											/>
										)}
										name="addressObject"
										rules={{ required: 'Please choose a matching address from the dropdown menu.' }}
										control={control}
									/>
									<FormHelperText>
										Please enter a <b>FULL</b> address (including street) and then <b>SELECT FROM DROPDOWN</b>
									</FormHelperText>
									<Controller
										render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
										name="countryCode"
										control={control}
									/>
									<Controller
										render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
										name="country"
										control={control}
									/>
									<Controller
										render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
										name="tzOffset"
										control={control}
									/>
									<Controller
										render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
										name="city"
										control={control}
									/>
									<Controller
										render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
										name="state"
										control={control}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												disabled={isReadOnly}
												helperText={errors.name ? errors.name.message : ''}
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												label="Address 2"
											/>
										)}
										name="address2"
										control={control}
									/>
								</Grid>

								<Grid item xs={12}>
									<CheckboxComponent disabled={isReadOnly} control={control} name="showOnMap" label="Show venue on map" />
								</Grid>

								<Grid item xs={12} style={{ height: '400px' }}>
									{/* @ts-ignore*/}
									<GoogleMapReact
										bootstrapURLKeys={{
											key: `${process.env.RAZZLE_RUNTIME_GOOGLE_API_KEY}`,
											libraries: ['places', 'geometry', 'drawing', 'visualization'],
										}}
										center={{ lat: coordinates[1], lng: coordinates[0] }}
										defaultZoom={15}
										yesIWantToUseGoogleMapApiInternals
									>
										{/*
  // @ts-ignore */}
										{coordinates && <MarkerSimple lat={coordinates[1]} lng={coordinates[0]} />}
									</GoogleMapReact>
								</Grid>

								<Grid item xs={12}>
									<Controller
										rules={{ required: 'Field is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.description}
												fullWidth
												multiline
												disabled={isReadOnly}
												minRows={4}
												InputLabelProps={{
													shrink: true,
												}}
												label="Building Description"
												variant="outlined"
												helperText={errors.description ? errors.description.message : ''}
											/>
										)}
										name="description"
										control={control}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												disabled={isReadOnly}
												fullWidth
												multiline
												minRows={4}
												label={
													<span>
														Special instructions{' '}
														<small>
															(These instructions will display on the Confirmation Booking email to the user.)
														</small>
													</span>
												}
												InputLabelProps={{ shrink: true }}
												placeholder="e.g., WIFI, cancellation policy, space policies, specific address or entry directions, etc."
												variant="outlined"
											/>
										)}
										name="specialInstructions"
										control={control}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl
										fullWidth
										className={errors.phone ? classes.phoneInput : classes.phoneInputError}
										error={!!errors.phone}
									>
										<InputLabel shrink>Phone number</InputLabel>

										<Controller
											render={({ field }) => (
												<PhoneInputComponent
													{...field}
													disabled={isReadOnly}
													onValidate={(isValid) => {
														if (isValid && errors.phone) clearErrors('phone');
														if (!isValid && !errors.phone)
															setError(
																'phone',
																{ type: 'isPhoneValid', message: 'Phone number is not valid' },
																{ shouldFocus: true }
															);
													}}
												/>
											)}
											rules={{
												required: 'Field is required',
											}}
											control={control}
											name="phone"
										/>
										{errors.phone && (
											<FormHelperText style={{ paddingLeft: 15 }} error>
												{errors.phone.message}
											</FormHelperText>
										)}
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<Controller
										rules={{ validate: handleEmailValidation, required: 'Field is required' }}
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.email}
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												label="Contact Email"
												helperText={errors.email ? errors.email.message : ''}
												disabled={isReadOnly}
											/>
										)}
										name="email"
										control={control}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<Controller
										name="brandId"
										render={({ field }) => (
											<AutocompleteAsync
												type="brand"
												label="Brand"
												{...field}
												disabled={!isSuperAdmin || isReadOnly}
												filter={
													{
														includeIds: initialValues?.brandId
															? [initialValues.brandId]
															: !isSuperAdmin && !initialValues && authBody
															? [authBody.brandId]
															: [],
													} as BrandFilter
												}
												error={errors.brandId}
											/>
										)}
										rules={{ required: 'Field is required' }}
										control={control}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<Controller
										name="venueTypeId"
										render={({ field }) => (
											<AutocompleteAsync
												{...field}
												type="venueType"
												label="Venue type"
												filter={{ limit: 20 } as VenueTypeFilter}
												disableClearable
												disabled={!(isBrandAdmin || isSuperAdmin) || isReadOnly}
												error={errors.venueTypeId}
											/>
										)}
										rules={{ required: 'Field is required' }}
										control={control}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl className={classes.formControl}>
										<Controller
											render={({ field }) => <SelectTimeZoneComponent {...field} error={errors.tzId} />}
											name="tzId"
											control={control}
										/>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl className={classes.formControl}>
										<Controller
											render={({ field }) => (
												<SelectCurrencyComponent {...field} error={!!errors.currency} disabled={isReadOnly} />
											)}
											name="currency"
											control={control}
										/>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<Controller
										render={({ field }) => (
											<SelectVenueStatusComponent
												{...field}
												error={errors.status}
												disabled={isReadOnly}
												hideDeleted={initialValues?.status !== VenueStatus.DELETED}
											/>
										)}
										rules={{ required: 'Field is required' }}
										name="status"
										control={control}
									/>
								</Grid>
							</Grid>
						</Grid>

						{!isReadOnly && (
							<Grid item xs={12} md={4} className={classes.uploadLogoWrap}>
								<input
									disabled={isReadOnly}
									className={classes.uploadInput}
									id="new-item-avatar"
									{...register('logo')}
									type="file"
									onChange={onUploadLogo}
								/>
								<label htmlFor="new-item-avatar" style={{ display: 'block', height: 90 }}>
									{!logo && (
										<IconButton className={classes.avatar} component="span" size="large">
											<>
												<AddIcon />
												<Typography>Add logo</Typography>
											</>
										</IconButton>
									)}
									{logo && <Avatar src={logo || '/images/logo-small.png'} className={classes.avatar} />}
								</label>
								{logoError !== '' && (
									<FormHelperText
										error
										className={classes.imageErrorText}
										style={{ textAlign: 'center', paddingTop: 25, marginTop: 25 }}
									>
										{logoError}
									</FormHelperText>
								)}
							</Grid>
						)}

						<Grid item xs={12}>
							<InputLabel shrink htmlFor="">
								Venue photos
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
									<IconButton
										color="primary"
										aria-label="upload picture"
										component="span"
										className={classes.photosClose}
										disabled={isReadOnly}
										onClick={() => {
											removeAttachment(i);
										}}
										size="large"
									>
										<CancelIcon />
									</IconButton>
								</div>
							))}

							{!isReadOnly && (
								<label htmlFor="new-item-pic" style={{ display: 'flex' }}>
									<IconButton className={classes.avatarSquare} component="span" size="large">
										<>
											<AddIcon />
											<Typography>Add photo</Typography>
										</>
									</IconButton>
								</label>
							)}
							<input
								accept="image/*"
								className={classes.uploadInput}
								// ref={picRef}
								{...register('uploadingPic')}
								id="new-item-pic"
								type="file"
								disabled={isReadOnly}
								onChange={onUploadPicture}
							/>
						</Grid>

						{picError !== '' && (
							<Grid item xs={12}>
								<FormHelperText error className={classes.imageErrorText}>
									{picError}
								</FormHelperText>
							</Grid>
						)}
					</Grid>

					<Typography className={classes.tabTitleWrapper}>Access</Typography>

					<Grid container spacing={3} className={classes.timeWrapper}>
						<Grid item xs={12} className={classes.timeLine}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<FormControl fullWidth>
										<InputLabel className={classes.timeLabel} shrink htmlFor="standard-adornment-password">
											Days open
										</InputLabel>
										<Typography className={classes.timeName}>Monday - Sunday</Typography>
									</FormControl>
								</Grid>

								<Grid item xs={6} md={3}>
									<Controller
										render={({ field }) => (
											<TimePicker
												{...field}
												renderInput={(props: any) => <TextField {...props} label="Opening Time" variant="outlined" />}
												// value={initialValues && initialValues.accessHoursFrom}
												disabled={accessCustom || isReadOnly}
											/>
										)}
										name="accessHoursFrom"
										control={control}
									/>
								</Grid>

								<Grid item xs={6} md={3}>
									<Controller
										render={({ field }) => (
											<TimePicker
												{...field}
												renderInput={(props: any) => <TextField {...props} variant="outlined" label="Closing Time" />}
												disabled={accessCustom || isReadOnly}
											/>
										)}
										name="accessHoursTo"
										control={control}
									/>
								</Grid>

								<Grid item xs={12} md={3} style={{ paddingTop: 30 }}>
									<CheckboxComponent
										disabled={isReadOnly}
										control={control}
										name="accessCustom"
										label="Different hours for each day"
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>

					{accessCustom && (
						<>
							<Typography className={classes.tabTitleWrapper}>Custom Access</Typography>
							<Grid container spacing={3} className={classes.timeWrapper}>
								{/*{accessCustomData.map((field: AccessCustomDataInterface, index: number) => (*/}
								{/*	<Controller*/}
								{/*		render={({ field: thisField }) => (*/}
								{/*			<TextField {...thisField} fullWidth style={{ opacity: 0 }} disabled={disabled} type="hidden" />*/}
								{/*		)}*/}
								{/*		name={`accessCustomData.${index}.weekday`}*/}
								{/*		control={control}*/}
								{/*		defaultValue={field.weekday}*/}
								{/*	/>*/}
								{/*))}*/}

								{/*// @ts-ignore*/}
								{accessCustomData.map((field: AccessHFormValues, index: number) => (
									<AccessTimeRowComponent
										key={field.id}
										field={field}
										index={index}
										watch={watch}
										disabled={isReadOnly}
										control={control}
									/>
								))}
							</Grid>
						</>
					)}

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
						{!isReadOnly && (
							<Grid item xs={12} className={classes.bottomWrap}>
								<Button
									variant="contained"
									color="secondary"
									size="large"
									style={{ marginTop: 15, marginRight: 15 }}
									onClick={() => {
										// eslint-disable-next-line no-self-assign
										window.location = window.location;
									}}
								>
									Cancel
								</Button>

								{initialValues && initialValues.id && (
									<Button
										variant="outlined"
										color="secondary"
										size="large"
										style={{ marginTop: 15, marginRight: 15 }}
										onClick={() => setConfirmDialogVisible(true)}
									>
										Delete venue
									</Button>
								)}

								<Button variant="contained" color="primary" type="submit" size="large" style={{ marginTop: 15 }}>
									{initialValues && initialValues.id ? 'Save' : 'Publish'} Venue
								</Button>
							</Grid>
						)}
					</Grid>
				</Paper>
			</form>

			<Dialog onClose={() => setImageEditVisible(false)} open={imageEditVisible}>
				<ImageEditor
					image={editingImage}
					aspectRatio={editingImageType === 'logo' ? 1 : 16 / 9}
					onCancel={() => setImageEditVisible(false)}
					onSave={handleImageSave}
				/>
			</Dialog>

			<Dialog onClose={handleClosePhotoPreview} open={photoPreviewVisible}>
				<img src={photoPreview} alt="" style={{ width: '100%' }} />
				<DialogActions>
					<Button onClick={handleClosePhotoPreview} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<Backdrop className={classes.backdrop} open={isLoading} onClick={() => setIsLoading(false)}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<ConfirmDialog
				text={`Are you sure you want to delete ${getValues('name')}?`}
				open={confirmDialogVisible}
				onClose={() => setConfirmDialogVisible(false)}
				action={handleDelete}
			/>
		</>
	);
}
