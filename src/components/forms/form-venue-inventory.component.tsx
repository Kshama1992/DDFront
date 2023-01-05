import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Controller, useForm } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SelectSpaceTypeComponent from '@forms/elements/select-space-type.component';
import SelectPackageStatusComponent from '@forms/elements/select-package-status.component';

export default function FormVenueInventoryComponent({ onSearch }: { onSearch: (formData: any) => any }) {
	const { handleSubmit, control, watch, getValues } = useForm({
		defaultValues: {
			searchString: '',
			spaceTypeId: 0,
			status: '',
		},
	});

	const status = watch('status');
	const spaceTypeId = watch('spaceTypeId');
	const searchString = watch('searchString');

	useEffect(() => {
		onSearch(getValues());
	}, [spaceTypeId, status, searchString]);

	const onSubmit = (formData: any) => {
		onSearch(formData);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={4}>
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								variant="filled"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								placeholder="Search Packages"
							/>
						)}
						name="searchString"
						control={control}
					/>
				</Grid>

				<Grid item xs={12} lg={4}>
					<SelectSpaceTypeComponent showAll control={control} />
				</Grid>

				<Grid item xs={12} lg={4}>
					<SelectPackageStatusComponent control={control} />
				</Grid>
			</Grid>
		</form>
	);
}
