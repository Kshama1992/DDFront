import React, { forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete from '@mui/material/Autocomplete';
import timezoneList from 'dd-common-blocks/libs/timezone-list.json';

interface SelectTZProps {
	initialValue?: string | '';
	disabled?: boolean;
	onChange?: (tz: string) => void;
	label?: string;
	error?: any;
}

const SelectTimeZoneComponent = forwardRef(({ onChange, disabled = false, error, label = 'Time zone', ...rest }: SelectTZProps, ref) => {
	const handleTZChange = (event: any, value: string) => {
		if (onChange) onChange(value);
	};

	return (
		<Autocomplete
			options={timezoneList}
			disableClearable
			autoComplete
			ref={ref}
			disabled={disabled}
			includeInputInList
			onChange={handleTZChange}
			renderInput={(params) => (
				<>
					<TextField
						error={error}
						{...params}
						label={label}
						fullWidth
						InputLabelProps={{
							shrink: true,
						}}
						variant="outlined"
					/>
					{error && <FormHelperText error>{error.message}</FormHelperText>}
				</>
			)}
			{...rest}
		/>
	);
});

export default SelectTimeZoneComponent;
