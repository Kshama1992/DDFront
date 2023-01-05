// / <reference types="@types/google.maps" />
import React, { useEffect, useMemo, useState, forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import makeStyles from '@mui/styles/makeStyles';
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { googleTimezoneHelper } from '@helpers/google-timezone.helper';
import { GeolocationData } from '@helpers/geolocate.helper';

const autocompleteService: { current: google.maps.places.AutocompleteService | null } = { current: null };

const useStyles = makeStyles((theme) => ({
	root: {},
	dropdown: {},
	icon: {
		color: theme.palette.text.secondary,
		marginRight: theme.spacing(2),
	},
	input: {},
}));

const getPlacePredictions = (input: google.maps.places.AutocompletionRequest, callback: any): void => {
	if (autocompleteService.current) {
		autocompleteService.current.getPlacePredictions(input, callback);
	}
};

function debounce(inner: typeof getPlacePredictions, ms = 0) {
	let timer: any = null;
	let resolves: any[] = [];

	return (...args: any) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			// @ts-ignore
			const result = inner(...args);
			resolves.forEach((r) => r(result));
			resolves = [];
		}, ms);

		return new Promise((r) => resolves.push(r));
	};
}

interface AddressSelectProps {
	onChange?: (address?: GeolocationData | undefined) => any;
	error: any;
	label: string;
	inputRef?: any;
	disabled?: boolean;
	helperText?: string;
}

const AddressSelectComponent = forwardRef(
	({ disabled = false, onChange, error, label = 'Building address', helperText = '', ...rest }: AddressSelectProps, ref) => {
		const classes = useStyles({});
		const [inputValue, setInputValue] = useState('');
		const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);

		const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
			setInputValue(e.target.value);
			if (e.target.value.length === 0 && onChange) onChange();
		};

		const fetch = useMemo(() => debounce(getPlacePredictions, 200), []);

		useEffect(() => {
			let active = true;

			if (typeof google === 'undefined') return;

			if (!autocompleteService.current) {
				autocompleteService.current = new google.maps.places.AutocompleteService();
			}
			if (!autocompleteService.current) {
				return;
			}

			if (inputValue === '') {
				setOptions([]);
				return;
			}

			fetch({ input: inputValue }, (results: google.maps.places.AutocompletePrediction[]) => {
				if (active) {
					setOptions(results || []);
				}
			});

			// eslint-disable-next-line consistent-return
			return () => {
				active = false;
			};
		}, [inputValue, fetch]);

		const handleAddressChange = (e: any, value: any) => {
			googleGeocodeHelper({ placeId: value.place_id }).then((res) =>
				googleTimezoneHelper(res.latitude, res.longitude).then((tzres) => {
					if (onChange) onChange({ ...res, ...tzres, address: value.description, description: value.description });
				})
			);
		};

		return (
			<Autocomplete
				getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
				classes={{
					listbox: classes.dropdown,
					paper: classes.dropdown,
					root: classes.root,
				}}
				options={options}
				disableClearable
				freeSolo
				ref={ref}
				disabled={disabled}
				autoComplete
				includeInputInList
				onChange={handleAddressChange}
				renderInput={(params) => (
					<TextField
						{...params}
						label={label}
						error={error}
						variant="outlined"
						onChange={handleInput}
						helperText={helperText}
						InputLabelProps={{ shrink: true }}
						InputProps={{
							...params.InputProps,
						}}
					/>
				)}
				{...rest}
			/>
		);
	}
);

export default AddressSelectComponent;
