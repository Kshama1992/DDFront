import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import generateSlug from '@helpers/slug.helper';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

export default function FormSpaceTypeComponent({ initialValues }: { initialValues?: SpaceTypeInterface }) {
	const {
		setValue,
		control,
		watch,
		formState: { errors },
	} = useForm<SpaceTypeInterface>({
		defaultValues:
			typeof initialValues !== 'undefined'
				? initialValues
				: { logicType: SpaceTypeLogicType.MONTHLY, name: '', alias: '', color: '', createdAt: new Date(), updatedAt: new Date() },
	});

	const name = watch('name');

	useEffect(() => {
		if (name) {
			setValue('name', name);
			setValue('alias', generateSlug(name));
		}
	}, [name]);

	return (
		<>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Grid container spacing={3}>
						<Grid item xs={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.name}
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
										label="Space Type Name"
										variant="outlined"
									/>
								)}
								rules={{ required: true }}
								name="name"
								control={control}
							/>
						</Grid>
						<Grid item xs={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.name}
										fullWidth
										InputLabelProps={{
											shrink: true,
										}}
										label="Space Type Alias"
										variant="outlined"
									/>
								)}
								rules={{ required: true }}
								name="alias"
								control={control}
							/>
						</Grid>

						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel id="select-brand-label" shrink>
									Brand Type
								</InputLabel>
								<Controller
									name="brandId"
									render={({ field }) => <AutocompleteAsync type="brand" label="Brand" {...field} />}
									rules={{ required: 'Field is required' }}
									control={control}
								/>
							</FormControl>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}
