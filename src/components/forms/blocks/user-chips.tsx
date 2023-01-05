// @ts-nocheck
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import UserService from '@service/user.service';
import AvatarComponent from '@shared-components/avatar.component';

export default function UserChipsBlock({
	initialValues = [],
	onChange,
	isReadOnly = false,
	showLabel = true,
	label = 'Users',
}: {
	initialValues?: UserInterface[];
	onChange: (brands: UserInterface[]) => void;
	isReadOnly?: boolean | undefined;
	showLabel?: boolean | undefined;
	label?: string;
}) {
	const userService = new UserService();
	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState<UserInterface[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<UserInterface[]>([]);

	useEffect(() => {
		let active = true;

		(async () => {
			setLoading(true);

			const [loadedUsers] = await userService.list({
				searchString: inputValue,
				limit: 10,
				withSubscriptions: false,
				withBrand: false,
				withPhoto: false,
			});

			if (active) {
				setOptions(loadedUsers);
			}
			setLoading(false);
		})();

		return () => {
			active = false;
		};
	}, [inputValue, value]);

	useEffect(() => {
		if (!open) {
			setOptions([]);
		}
	}, [open]);

	return (
		<Grid item xs={12}>
			<Autocomplete
				id="users-async"
				// @ts-ignore
				defaultValue={initialValues}
				open={open}
				onOpen={() => {
					setOpen(true);
				}}
				disabled={isReadOnly}
				onClose={() => {
					setOpen(false);
				}}
				isOptionEqualToValue={(option, selValue) => {
					if (typeof selValue === 'string') return false;
					// @ts-ignore
					if (typeof selValue === 'number') return option.id === selValue;
					// @ts-ignore
					return option.id === selValue.id;
				}}
				getOptionLabel={(option) => {
					if (typeof option === 'string') return option;
					if (typeof option === 'number') {
						const item = options.find((o) => o.id === option);
						return item ? `${item.firstname} ${item.lastname}` : String(option);
					}
					// @ts-ignore
					return `${option.firstname} ${option.lastname}`;
				}}
				// @ts-ignore
				renderOption={(props, option, { selected }) => (
					<li {...props}>
						<AvatarComponent
							// className={classes.avatar}
							size="xs"
							altText={option.firstname}
							src={option.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${option.photo.url}` : undefined}
						/>
						{option.firstname} {option.lastname}
					</li>
				)}
				autoComplete
				includeInputInList
				filterSelectedOptions
				value={value}
				onChange={(event: any, newValue: UserInterface[] | null) => {
					setOptions(newValue ? [...newValue, ...options] : options);
					if (newValue) {
						setValue(newValue);
						onChange(newValue);
					}
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				multiple
				options={options}
				loading={loading}
				renderInput={(params) => (
					<TextField
						{...params}
						label={showLabel ? label : false}
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
					/>
				)}
			/>
		</Grid>
	);
}
