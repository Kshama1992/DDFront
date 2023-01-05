import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

export default function SelectPackageShowComponent({
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
	const options: PackageShow[] = Object.values(PackageShow);

	return (
		<FormControl className={classes.formControl} disabled={disabled}>
			{showLabel && <InputLabel id="select-package-show-label">Make this visible to:</InputLabel>}
			<Controller
				render={({ field }) => (
					<Select {...field} labelId="select-package-show-label" placeholder="Please select" error={!!error}>
						{options.map((i: PackageShow) => (
							<MenuItem value={i} key={i}>
								{i}
							</MenuItem>
						))}
					</Select>
				)}
				name="packageShow"
				control={control}
				rules={{ required }}
				defaultValue={initialValue}
			/>
		</FormControl>
	);
}
