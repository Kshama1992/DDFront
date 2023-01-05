import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import geolocateHelper from '@helpers/geolocate.helper';
import { AuthContext, DEFAULT_LOCATION } from '@context/auth.context';
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { googleTimezoneHelper } from '@helpers/google-timezone.helper';

const autocompleteService: { current: google.maps.places.AutocompleteService | null } = { current: null };

const useStyles = makeStyles((theme) => ({
	'& .MuiInput-underline:before': {
		display: 'none !important',
	},
	'& .MuiInput-underline:after': {
		display: 'none !important',
	},

	root: {
		marginTop: -7,
	},
	dropdown: {
		width: 200,
	},
	icon: {
		color: theme.palette.text.secondary,
		marginRight: theme.spacing(2),
	},
	input: {
		'&:after': {
			display: 'none !important',
		},
		'&:before': {
			display: 'none !important',
		},

		'& label': {
			color: theme.palette.grey.A200,
			fontSize: 14,
			fontWeight: 500,
			marginTop: 2,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		'& label + div': {
			background: 'none',
		},
		'& input': {
			border: 'none',
			fontSize: 15,
			padding: 12,
			fontWeight: 500,
			marginTop: 4,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		'& .MuiInput-underline:before': {
			display: 'none',
		},
	},
}));

const getPlacePredictions = (input: google.maps.places.AutocompletionRequest, callback: any): void => {
	if (autocompleteService.current) {
		autocompleteService.current.getPlacePredictions(input, callback);
	}
};

function debounce(inner: typeof getPlacePredictions, ms = 0) {
	let timer: any = null;
	let resolves: any[] = [];

	// eslint-disable-next-line func-names
	return function (...args: any) {
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

function GooglePlacesSelectComponent() {
	const classes = useStyles({});
	const { userLocation, setUserLocation } = useContext(AuthContext);
	const [inputValue, setInputValue] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);
	const [options, setOptions] = useState([]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setInputValue(e.target.value);
	};

	const fetch = useMemo(() => debounce(getPlacePredictions, 200), []);

	const setUserDefaultLocation = useCallback(async () => {
		if (userLocation && userLocation.latitude) {
			setIsLoaded(true);
		} else {
			try {
				const locationData = await geolocateHelper(true);
				if (locationData) {
					setUserLocation(locationData);
				}
				setIsLoaded(true);
			} catch (e) {
				console.error('geo e. going to default val', e);
				setUserLocation(DEFAULT_LOCATION);
				setIsLoaded(true);
			}
		}
	}, [setUserLocation, setInputValue, userLocation]);

	useEffect(() => {
		setUserDefaultLocation().then();
	}, [setUserLocation, setInputValue, userLocation]);

	useEffect(() => {
		let active = true;

		if (typeof google === 'undefined') return;

		if (!autocompleteService.current) {
			autocompleteService.current = new google.maps.places.AutocompleteService();
		}
		if (!autocompleteService.current) {
			return undefined;
		}

		if (inputValue === '') {
			setOptions([]);
			return undefined;
		}

		fetch({ input: inputValue }, (results: any) => {
			if (active) {
				setOptions(results || []);
			}
		});

		return () => {
			active = false;
		};
	}, [inputValue, fetch, userLocation]);

	const onChange = (e: any, value: any) => {
		googleGeocodeHelper({ placeId: value.place_id }).then((res) =>
			googleTimezoneHelper(res.latitude, res.longitude).then((tzres) => setUserLocation({ ...res, ...tzres }))
		);
	};

	if (!isLoaded) return <CircularProgress style={{ margin: '10px auto', display: 'block' }} />;

	let cityState = userLocation && userLocation.city ? userLocation.city : '';
	if (userLocation && typeof userLocation.state !== 'undefined' && userLocation.state !== '') {
		cityState += `${cityState !== '' ? ', ' : ''}${userLocation.state}`;
	}

	return (
		<Autocomplete
			getOptionLabel={(option) => option.description}
			classes={{
				listbox: classes.dropdown,
				paper: classes.dropdown,
				root: classes.root,
			}}
			filterOptions={(x) => x}
			options={options}
			autoComplete
			includeInputInList
			disableClearable
			defaultValue={{ description: `${cityState !== '' ? `${cityState}, ` : ''}${userLocation ? userLocation.country : ''}` }}
			freeSolo
			onChange={onChange}
			renderInput={(params) => (
				<TextField {...params} variant="standard" className={classes.input} label="YOU ARE IN" fullWidth onChange={handleChange} />
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

export default memo(GooglePlacesSelectComponent);
