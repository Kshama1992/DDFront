import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import generateSlug from '@helpers/slug.helper';
import VenueTypeService from '@service/venue-type.service';

export default function FormVenueTypeComponent({
	initialValues,
	onCancel,
	onSave,
}: {
	initialValues?: VenueTypeInterface;
	onCancel: () => any;
	onSave: (data: VenueTypeInterface) => void;
}) {
	const venueTypeService = new VenueTypeService();

	const {
		setValue,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<VenueTypeInterface>({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : { name: '', alias: '', createdAt: new Date(), updatedAt: new Date() },
	});

	const name = watch('name');

	useEffect(() => {
		if (name) {
			setValue('alias', generateSlug(name), { shouldValidate: true });
		}
	}, [name]);

	const save = async (formData: VenueTypeInterface) => {
		const cloneData = formData;
		await venueTypeService.save(formData, initialValues?.id);
		onSave(cloneData);
	};

	return (
		<form onSubmit={handleSubmit(save)}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Controller
						defaultValue=""
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.name}
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
								label="Venue Type Name"
								variant="outlined"
							/>
						)}
						rules={{ required: true }}
						name="name"
						control={control}
					/>
				</Grid>
				<Grid item xs={12}>
					<Controller
						defaultValue=""
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.name}
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
								disabled
								label="Venue Type Alias"
								variant="outlined"
							/>
						)}
						rules={{ required: true }}
						name="alias"
						control={control}
					/>
				</Grid>
				<Grid item xs={12}>
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
						{!initialValues || !initialValues.id ? 'Create' : 'Edit'} venue type
					</Button>
				</Grid>
			</Grid>
		</form>
	);
}
