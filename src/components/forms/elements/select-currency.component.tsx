import React, { forwardRef, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import currencyList from 'dd-common-blocks/libs/currency.json';

interface SelectCurrencyProps {
	initialValue?: string | '';
	disabled?: boolean;
	error?: any;
	value: any;
}

const SelectTimeZoneComponent = forwardRef(({ disabled = false, error, value, ...rest }: SelectCurrencyProps, ref) => {
	const [inputValue, setInputValue] = useState(value || '');
	const options: string[] = Object.keys(currencyList).sort();

	useEffect(() => {
		setInputValue(value || '');
	}, [value]);

	return (
		<Autocomplete
			id="select-currency"
			{...rest}
			disableClearable
			disablePortal
			autoSelect
			clearOnBlur
			selectOnFocus
			options={options}
			ref={ref}
			value={inputValue}
			onChange={(e, data) => {
				setInputValue(data);
				// @ts-ignore
				if (rest.onChange) rest.onChange(data);
			}}
			disabled={disabled}
			renderInput={(params) => (
				<TextField
					variant="outlined"
					{...params}
					{...rest}
					label="Currency"
					fullWidth
					error={error}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			)}
		/>
	);
});

export default SelectTimeZoneComponent;
