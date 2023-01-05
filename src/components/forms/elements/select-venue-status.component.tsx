import React, { forwardRef } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';

const SelectVenueStatusComponent = forwardRef(
	(
		{
			showLabel = true,
			disabled = false,
			hideDeleted = false,
			error,
			...rest
		}: {
			disabled?: boolean;
			showLabel?: boolean;
			hideDeleted?: boolean;
			error?: any;
		},
		ref
	) => {
		return (
			<FormControl fullWidth disabled={disabled}>
				{showLabel && (
					<InputLabel id="select-venue-status-label" shrink>
						Venue status
					</InputLabel>
				)}

				<Select
					ref={ref}
					labelId="select-venue-status-label"
					error={!!error}
					displayEmpty
					variant="outlined"
					placeholder="Venue status"
					{...rest}
				>
					<MenuItem value={VenueStatus.PUBLISH}>Published</MenuItem>
					<MenuItem value={VenueStatus.UNPUBLISED}>Unpublished</MenuItem>
					{!hideDeleted && <MenuItem value={VenueStatus.DELETED}>Deleted</MenuItem>}
				</Select>
				{error && <FormHelperText error>{error.message}</FormHelperText>}
			</FormControl>
		);
	}
);

export default SelectVenueStatusComponent;
