import React, { useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import FormHelperText from '@mui/material/FormHelperText';
import SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';
import { AuthContext } from '@context/auth.context';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

export default function SelectSubscriptionStatusComponent({
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
	const { isSuperAdmin } = useContext(AuthContext);

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
						<MenuItem value={SubscriptionStatus.ACTIVE} key={0}>
							Active
						</MenuItem>
						<MenuItem value={SubscriptionStatus.INACTIVE} key={1}>
							Inactive
						</MenuItem>
						{isSuperAdmin && (
							<MenuItem value={SubscriptionStatus.DELETED} key={1}>
								Deleted
							</MenuItem>
						)}
						{isSuperAdmin && (
							<MenuItem value={SubscriptionStatus.CANCELED} key={1}>
								Canceled
							</MenuItem>
						)}
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
