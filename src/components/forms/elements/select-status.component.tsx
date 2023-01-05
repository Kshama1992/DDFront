import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import FormHelperText from '@mui/material/FormHelperText';
import EntityStatus from 'dd-common-blocks/dist/type/EntityStatus';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

export default function SelectStatusComponent({
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
	const classes = useStyles();

	return (
		<FormControl className={classes.formControl} disabled={disabled} error={!!error}>
			{showLabel && (
				<InputLabel id="select-status-label" shrink>
					Status
				</InputLabel>
			)}
			<Controller
				render={({ field }) => (
					<Select {...field} labelId="select-status-label" variant="outlined" placeholder="Please select" error={!!error}>
						<MenuItem value={EntityStatus.ACTIVE} key={0}>
							Active
						</MenuItem>
						<MenuItem value={EntityStatus.INACTIVE} key={1}>
							Inactive
						</MenuItem>
					</Select>
				)}
				name="status"
				control={control}
				rules={{ required: required ? 'This field is required' : false }}
				defaultValue={initialValue}
			/>
			{error && <FormHelperText error>{error.message}</FormHelperText>}
		</FormControl>
	);
}
