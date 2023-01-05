import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { debounce } from '@helpers/debounce.helper';
import { AuthContext } from '@context/auth.context';
import { GeolocationData } from '@helpers/geolocate.helper';

const autocompleteService: { current: google.maps.places.AutocompleteService | null } = { current: null };

const useStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: 15,
	},
	expandIcon: {
		color: theme.palette.primary.main,
	},

	input: {
		'& .MuiInput-root ': {
			// paddingLeft: 15,
			paddingTop: 5,
		},
		'& .MuiInput-underline:before': {
			display: 'none !important',
		},
		'& .MuiInput-underline:after': {
			display: 'none !important',
		},

		'& label': {
			color: '#333',
			fontWeight: 500,
			fontSize: 14,
			marginTop: -7,
			textTransform: 'uppercase',
		},
		'& label + div': {
			background: 'none',
			margin: '15px 0 0 0',
		},
		'& input': {
			border: 'none',
			fontSize: 16,
			padding: 12,
		},
	},
	option: {
		fontSize: 15,
		'& > span': {
			marginRight: 10,
			fontSize: 18,
		},
	},
}));

const getPlacePredictions = (input: google.maps.places.AutocompletionRequest, callback: any): void => {
	if (autocompleteService.current) {
		autocompleteService.current.getPlacePredictions(input, callback);
	}
};

function SpaceLocationSelectComponent({
	disableClearable = true,
	showSearchIcon = false,
	onSelect,
	onChange,
	defaultValue,
	text = 'Where:',
}: {
	text?: string;
	disableClearable?: boolean;
	showSearchIcon?: boolean;
	onSelect?: () => void;
	onChange?: (location: GeolocationData) => void;
	defaultValue?: GeolocationData | undefined;
}) {
	const classes = useStyles({});
	const { userLocation } = useContext(AuthContext);
	const [inputValue, setInputValue] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);
	const [options, setOptions] = useState([]);

	const [location, setLocation] = useState<GeolocationData | undefined>(defaultValue);

	const getVal = (inputLocation: GeolocationData) => {
		let cityState = (inputLocation && inputLocation.city) || '';
		if (inputLocation && typeof inputLocation.state !== 'undefined' && inputLocation.state !== '') {
			cityState += `${cityState !== '' ? ', ' : ''}${inputLocation.state}`;
		}

		if (inputLocation && typeof inputLocation.country !== 'undefined' && inputLocation.country !== '') {
			cityState = `${cityState !== '' ? `${cityState}, ` : ''}${inputLocation ? inputLocation.country : ''}`;
		}
		return cityState;
	};

	const [val, setVal] = useState({ description: `${location ? getVal(location) : 'Please select your location'}` });

	useEffect(() => {
		if (location && onChange) {
			onChange(location);
		}
	}, [location]);

	useEffect(() => {
		if (defaultValue && defaultValue.country) {
			setVal({ description: getVal(defaultValue) });
		}
	}, [defaultValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setInputValue(e.target.value);
	};

	const fetch = useMemo(() => debounce(getPlacePredictions, 200), []);

	useEffect(() => {
		if (location && location.country) {
			setIsLoaded(true);
		} else {
			if (userLocation) setLocation({ ...userLocation });
			setIsLoaded(true);
		}
	}, [location, setIsLoaded]);

	useEffect(() => {
		let active = true;

		if (typeof google === 'undefined') return;

		if (!autocompleteService.current) {
			// eslint-disable-next-line no-undef
			autocompleteService.current = new google.maps.places.AutocompleteService();
		}
		if (!autocompleteService.current) {
			// eslint-disable-next-line consistent-return
			return undefined;
		}

		if (inputValue === '') {
			setOptions([]);
			// eslint-disable-next-line consistent-return
			return undefined;
		}

		fetch({ input: inputValue }, (results: any) => {
			if (active) {
				setOptions(results || []);
			}
		});

		// eslint-disable-next-line consistent-return
		return () => {
			active = false;
		};
	}, [inputValue, fetch, setOptions]);

	const onChanged = async (e: any, value: any) => {
		if (value && value.place_id) {
			const res = await googleGeocodeHelper({ placeId: value.place_id });
			setVal(value);
			setLocation(res);
			if (onSelect) onSelect();
		}
	};

	if (!isLoaded) return <CircularProgress style={{ margin: '10px auto', display: 'block' }} />;

	return (
		<Autocomplete
			value={val}
			style={{ width: '100%' }}
			getOptionLabel={(option) => option.description}
			filterOptions={(x) => x}
			options={options}
			autoComplete
			classes={{
				root: classes.root,
				option: classes.option,
			}}
			includeInputInList
			disableClearable={disableClearable}
			defaultValue={{ description: `${location ? getVal(location) : 'Please select your location'}` }}
			freeSolo
			onChange={onChanged}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="standard"
					InputProps={{
						...params.InputProps,
						startAdornment: showSearchIcon && (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					className={classes.input}
					label={text}
					fullWidth
					onChange={handleChange}
				/>
			)}
			renderOption={(props, option) => (
				<li {...props}>
					<Typography variant="caption" style={{ fontSize: 13 }}>
						{option.description}
					</Typography>
				</li>
			)}
		/>
	);
}

export default memo(SpaceLocationSelectComponent);
