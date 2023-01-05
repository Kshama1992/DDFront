import React, { useCallback, useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import AmenityInterface from 'dd-common-blocks/dist/interface/amenity.interface';
import AmenityService from '@service/amenity.service';

export default function SelectAmenityTypeComponent({
	initialValue = '',
	showLabel = true,
	disabled = false,
	control,
	required = false,
	error,
}: {
	disabled?: boolean;
	showLabel?: boolean;
	initialValue?: number | '';
	control: any;
	required?: boolean;
	error?: any;
}) {
	const amenityService = new AmenityService();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [options, setOptions] = useState<AmenityInterface[]>([]);

	const loadOptions = useCallback(async () => {
		setIsLoading(true);
		try {
			const [data] = await amenityService.list();
			setOptions(data);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadOptions().then();
	}, []);

	if (isLoading) return <CircularProgress />;

	return (
		<FormControl fullWidth disabled={disabled}>
			{showLabel && (
				<InputLabel id="select-amenity-type-label" shrink>
					Amenity Type
				</InputLabel>
			)}
			<Controller
				render={({ field }) => (
					<Select {...field} labelId="select-amenity-type-label" placeholder="Please select" variant="outlined" error={!!error}>
						{options.map((i: AmenityInterface) => (
							<MenuItem value={i.id} key={i.id}>
								{i.name}
							</MenuItem>
						))}
					</Select>
				)}
				name="amenityId"
				control={control}
				rules={{ required }}
				defaultValue={initialValue}
			/>
		</FormControl>
	);
}
