import React, { useCallback, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Controller, useForm } from 'react-hook-form';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import AmenityInterface from 'dd-common-blocks/dist/interface/amenity.interface';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';
import { DEFAULT_CURRENCY } from '@core/config';
import decodeHTMLContent from '@helpers/decode-html.helper';
import AmenityService from '@service/amenity.service';
import SelectAmenityTypeComponent from '@forms/elements/select-amenity-type.component';
import SelectChargeTypeComponent from '@forms/elements/select-charge-type.component';
import { getCurrencySymbol } from 'dd-common-blocks';
import LoadingButton from '@forms/elements/loading-button.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiFormLabel-root, & .MuiFormControlLabel-label': {
				textTransform: 'uppercase',
				fontSize: 12,
				fontWeight: 500,
				color: theme.palette.text.primary,
			},
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
		},
		hiddenField: {
			width: 0,
			height: 0,
			opacity: 0,
		},
		container: {
			padding: '0 35px 25px 35px',
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
	})
);

export default function FormAmenityComponent({
	initialValues,
	spaceChargeType,
	onSave,
	onCancel,
	venueData,
}: {
	spaceChargeType?: ChargeType | undefined;
	initialValues?: SpaceAmenityInterface;
	onSave: (data: SpaceAmenityInterface) => any;
	onCancel?: () => any;
	venueData?: VenueInterface;
}) {
	const classes = useStyles({});
	const amenityService = new AmenityService();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [amenityList, setAmenityList] = useState<AmenityInterface[]>([]);

	const spaceCurrency = typeof venueData?.currency === 'undefined' ? DEFAULT_CURRENCY.code : venueData.currency;

	const {
		getValues,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: initialValues || {
			id: undefined,
			amenityId: undefined,
			chargeType: undefined,
			name: '',
			description: '',
			price: 0,
			salesTax: 0,
		},
	});

	const loadAmenities = useCallback(async () => {
		const [list] = await amenityService.list();
		setAmenityList(list);
	}, [amenityList]);

	useEffect(() => {
		loadAmenities().then();
	}, []);

	const save = () => {
		setIsLoading(true);
		const formData = getValues();
		const clone = formData;
		const priceMatch: any = formData.price ? String(formData.price).match(/[\d.]+/) : null;

		clone.price = priceMatch ? parseFloat(priceMatch) : 0;
		// @ts-ignore
		if (!clone.salesTax || clone.salesTax === '') clone.salesTax = 0;
		// @ts-ignore
		clone.salesTax = parseInt(clone.salesTax, 10);

		if (!Object.keys(errors).length) {
			const amenity = amenityList.find((a) => a.id === clone.amenityId);
			// @ts-ignore
			onSave({
				...clone,
				amenity,
				chargeType: clone.chargeType,
			});
		}
	};

	return (
		<div className={classes.root}>
			<Grid container spacing={3} className={classes.container}>
				<Grid item xs={12}>
					<SelectAmenityTypeComponent control={control} />
				</Grid>

				<Grid item xs={12}>
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.name}
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
								label="Custom Amenity Name"
							/>
						)}
						name="name"
						control={control}
					/>
					<Controller
						render={({ field }) => <TextField className={classes.hiddenField} {...field} type="hidden" />}
						name="id"
						control={control}
					/>
				</Grid>

				<Grid item xs={12}>
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.description}
								fullWidth
								variant="outlined"
								InputLabelProps={{
									shrink: true,
								}}
								label="Description"
							/>
						)}
						name="description"
						control={control}
					/>
				</Grid>

				<Grid item xs={12}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<SelectChargeTypeComponent
								control={control}
								initialValue={ChargeType.FREE}
								filter={{
									names: spaceChargeType
										? [spaceChargeType, ChargeType.FREE]
										: [ChargeType.MONTHLY, ChargeType.ONE_TIME, ChargeType.HOURLY, ChargeType.FREE],
								}}
							/>
						</Grid>

						<Grid item xs={12} md={3}>
							<Controller
								rules={{
									required: 'Field is required',
								}}
								render={({ field }) => (
									// @ts-ignore
									<NumberFormat
										{...field}
										error={!!errors.price}
										helperText={errors.price ? errors.price.message : ''}
										customInput={TextField}
										fullWidth
										decimalScale={2}
										allowNegative={false}
										allowLeadingZeros={true}
										fixedDecimalScale={true}
										variant="outlined"
										prefix={decodeHTMLContent(getCurrencySymbol(spaceCurrency))}
										label="Price"
										InputLabelProps={{
											shrink: true,
										}}
									/>
								)}
								name="price"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={3}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.salesTax}
										fullWidth
										variant="outlined"
										InputProps={{
											endAdornment: <InputAdornment position="start">%</InputAdornment>,
										}}
										label="Sales Tax"
									/>
								)}
								name="salesTax"
								control={control}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} style={{ textAlign: 'center' }}>
					<Button
						variant="contained"
						color="secondary"
						type="button"
						style={{ marginRight: 15 }}
						onClick={() => (onCancel ? onCancel() : {})}
					>
						Cancel
					</Button>
					<LoadingButton
						variant="contained"
						text={`${initialValues ? 'Edit' : 'Add'} Amenity`}
						isLoading={isLoading}
						color="primary"
						type="submit"
						onClick={save}
					/>
				</Grid>
			</Grid>
		</div>
	);
}
