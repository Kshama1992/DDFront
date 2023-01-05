import React, { forwardRef, useEffect, useState } from 'react';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import 'react-phone-input-2/lib/material.css';
import PhoneInput from 'react-phone-input-2';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const useStyles = makeStyles(() =>
	createStyles({
		standard: {
			inputStyle: {
				color: 'green',
			},
		},
		outlined: {},
		filled: {},
	})
);

interface PhoneInputProps {
	name?: string;
	disabled?: boolean;
	error?: boolean;
	autoFocus?: boolean;
	placeholder?: string;
	country?: string;
	className?: string;
	onValidate?: (isValid: boolean) => void;
	onChange?: (phone: string) => void;
	variant?: 'outlined' | 'filled' | 'standard';
}

const PhoneInputComponent = forwardRef(
	(
		{
			name = 'phone',
			autoFocus = false,
			variant = 'standard',
			onValidate,
			className,
			country = 'us',
			placeholder = 'Enter phone number',
			disabled = false,
			error,
			onChange,
			...rest
		}: PhoneInputProps,
		ref
	) => {
		const [selCountryCode, setSelCountryCode] = useState(country);
		const [isValid, setIsValid] = useState(true);

		useEffect(() => {
			if (onValidate) onValidate(isValid);
		}, [isValid]);

		const classes = useStyles();
		return (
			<PhoneInput
				{...rest}
				style={{ width: '100%' }}
				inputStyle={{ color: '#7a7a7a' }}
				className={classes[variant]}
				disabled={disabled}
				placeholder={placeholder}
				country={country}
				enableSearch
				inputProps={{
					ref,
					name,
					required: true,
					autoFocus: autoFocus,
				}}
				onChange={(inputPhone, countryData) => {
					if (!countryData || !countryData.countryCode) return;
					if (countryData.countryCode !== selCountryCode) {
						setIsValid(true);
					}
					setSelCountryCode(countryData.countryCode);
					if (onChange) onChange(inputPhone);
					return inputPhone;
				}}
				// @ts-ignore
				onBlur={(e) => (isPossiblePhoneNumber(e.target.value, selCountryCode) ? setIsValid(true) : setIsValid(false))}
				isValid={() => isValid}
			/>
		);
	}
);

export default PhoneInputComponent;
