import React, { memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Input } from '@mui/material';
import InvoiceItemInterface, { InvoiceItemType } from 'dd-common-blocks/dist/interface/invoice-item.interface';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import SelectChargeTypeComponent from '@forms/elements/select-charge-type.component';

function FormInvoiceItemComponent({ initialValues, onSave }: { initialValues?: InvoiceItemInterface; onSave: (item: InvoiceItemInterface) => any }) {
	const [itemType, setItemType] = useState<InvoiceItemType.EXTRA | InvoiceItemType.DISCOUNT>(InvoiceItemType.EXTRA);

	const chargeTypesFilter = [ChargeType.ONE_TIME, ChargeType.MONTHLY];

	const emptyItem = {
		quantity: 0,
		price: 0,
		name: '',
		tax: 0,
		invoiceItemType: InvoiceItemType.EXTRA,
		chargeType: ChargeType.HOURLY,
	};

	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : emptyItem,
	});

	const save = async (formData: InvoiceItemInterface) => {
		const clone = { ...formData };

		clone.price = Number(formData.price || 0);
		clone.price2 = Number(formData.price || 0);

		if (formData.invoiceItemType === InvoiceItemType.DISCOUNT) {
			clone.price = -Number(formData.price || 0);
			clone.price2 = -Number(formData.price || 0);
		}

		clone.tax = Number(formData.tax || 0);
		clone.quantity = Number(formData.quantity || 1);

		onSave(clone);
	};

	const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newType: InvoiceItemType.EXTRA | InvoiceItemType.DISCOUNT) => {
		if (newType.length) {
			setItemType(newType);
			setValue('invoiceItemType', newType);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit((d) => save(d as InvoiceItemInterface))} style={{ padding: 25 }}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography>Add Extras or Discounts</Typography>
					</Grid>
				</Grid>

				<Grid container spacing={2} direction="column" alignItems="center">
					<Grid item>
						<Controller render={({ field }) => <Input {...field} type="hidden" />} name="invoiceItemType" control={control} />
						<ToggleButtonGroup size="small" value={itemType} exclusive onChange={handleTypeChange}>
							<ToggleButton value={InvoiceItemType.EXTRA}>Extra</ToggleButton>
							<ToggleButton value={InvoiceItemType.DISCOUNT}>DISCOUNT</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
				</Grid>
				<Grid container spacing={3}>
					<Grid item xs={9}>
						<Controller
							rules={{ required: true }}
							render={({ field }) => (
								<TextField {...field} fullWidth label="Item name" InputLabelProps={{ shrink: true }} variant="outlined" />
							)}
							name="name"
							control={control}
						/>
					</Grid>

					<Grid item xs={3}>
						<SelectChargeTypeComponent
							control={control}
							required
							error={errors.chargeType}
							helperText={errors.chargeType ? 'Field is required' : ''}
							filter={{
								names: chargeTypesFilter,
							}}
						/>
					</Grid>

					<Grid item xs={2}>
						<Controller
							rules={{ required: true }}
							render={({ field }) => <TextField {...field} variant="outlined" label="Quantity" />}
							name="quantity"
							control={control}
						/>
					</Grid>
					<Grid item xs={2}>
						<Controller
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									{...field}
									variant="outlined"
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>,
									}}
									label="Price"
								/>
							)}
							name="price"
							control={control}
						/>
					</Grid>
					<Grid item xs={2}>
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									variant="outlined"
									InputProps={{
										endAdornment: <InputAdornment position="end">%</InputAdornment>,
									}}
									label="Tax"
								/>
							)}
							name="tax"
							control={control}
						/>
					</Grid>

					<Grid item xs={6}>
						<Button type="submit" variant="contained" color="primary" style={{ marginTop: 15 }}>
							Add {itemType}
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
}

export default memo(FormInvoiceItemComponent);
