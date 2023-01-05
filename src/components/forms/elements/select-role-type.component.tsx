import React, { memo, useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import BrandRoleType from 'dd-common-blocks/dist/type/BrandRoleType';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

function SelectRoleTypeComponent({
	initialValue,
	showLabel = true,
	disabled = false,
	filter,
	control,
	name = 'roleType',
	required = false,
	error,
	helperText = '',
}: {
	disabled?: boolean;
	showLabel?: boolean;
	initialValue?: BrandRoleType;
	filter?: { names?: string[]; ids?: number[] };
	control: any;
	name?: string;
	required?: boolean;
	error?: any;
	helperText?: string;
}) {
	const classes = useStyles();
	const roleTypes: BrandRoleType[] = Object.values(BrandRoleType);
	const [options, setOptions] = useState<BrandRoleType[]>(roleTypes);

	useEffect(() => {
		if (filter) {
			if (filter.names) setOptions(roleTypes.filter((d: BrandRoleType) => (filter.names ? filter.names.includes(d) : true)));
		}
	}, [filter]);

	return (
		<FormControl className={classes.formControl} disabled={disabled}>
			{showLabel && (
				<InputLabel shrink id="select-role-type-label">
					Role Type
				</InputLabel>
			)}
			<Controller
				render={({ field }) => (
					<Select {...field} labelId="select-role-type-label" placeholder="Please select" error={!!error} variant="outlined">
						{options.map((i: BrandRoleType) => (
							<MenuItem value={i} key={i}>
								{i}
							</MenuItem>
						))}
					</Select>
				)}
				name={name}
				control={control}
				rules={{ required }}
				defaultValue={initialValue}
			/>
			{helperText !== '' && (
				<FormHelperText style={{ paddingLeft: 15 }} error>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
}

export default memo(SelectRoleTypeComponent);
