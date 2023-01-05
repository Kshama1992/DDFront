/* eslint-disable no-use-before-define */
import React, { memo, useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CurrencyInterface from 'dd-common-blocks/dist/interface/custom/currency.interface';
import { AuthContext } from '@context/auth.context';
import { DEFAULT_CURRENCY } from '@core/config';
import getCurrencyRates from '@helpers/currency-rates.helper';
import currencyList from 'dd-common-blocks/libs/currency.json';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: -7,
	},

	dropdown: {
		width: 300,
	},
	input: {
		border: 'none',
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
			fontWeight: 500,
			padding: 12,
			marginTop: 4,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		'& .MuiInput-underline:before': {
			display: 'none',
		},
		'& button': {
			display: 'none',
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

function CurrencySelectComponent() {
	const classes = useStyles({});
	const options = Object.values(currencyList);

	const { userCurrency, setUserCurrency, setCurrencyRate } = useContext(AuthContext);

	const [value, setValue] = useState(userCurrency);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!userCurrency) return;
		setValue(userCurrency);
		setIsLoading(true);
		getCurrencyRates(userCurrency?.code || DEFAULT_CURRENCY.code).then((resp) => {
			setCurrencyRate(resp);
			setIsLoading(false);
		});
	}, [userCurrency]);

	const onChange = (e: any, thisValue: CurrencyInterface | null) => {
		if (thisValue) {
			setValue(thisValue);
			setUserCurrency(thisValue);
		}
	};

	if (isLoading && !userCurrency) return <CircularProgress style={{ margin: '10px auto', display: 'block' }} />;

	return (
		<Autocomplete
			options={options}
			classes={{
				option: classes.option,
				listbox: classes.dropdown,
				paper: classes.dropdown,
				root: classes.root,
			}}
			onChange={onChange}
			disableClearable
			value={value}
			isOptionEqualToValue={(option, thisValue) => option.code === thisValue.code}
			// @ts-ignore
			getOptionLabel={(option) => option.code}
			popupIcon={<ExpandMoreIcon />}
			renderOption={(props, option) => (
				<li {...props}>
					<Typography variant="caption" style={{ fontSize: 13 }}>
						<div className={`currency-flag currency-flag-sm currency-flag-${option.code.toLowerCase()}`} />
						{option.name} ({option.code})
					</Typography>
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					label="CURRENCY"
					variant="standard"
					className={classes.input}
					placeholder="Select your currency"
					fullWidth
					inputProps={{
						...params.inputProps,
						autoComplete: 'disabled',
					}}
				/>
			)}
		/>
	);
}

export default memo(CurrencySelectComponent);
