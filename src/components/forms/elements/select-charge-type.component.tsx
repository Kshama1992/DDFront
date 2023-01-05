import React, { useEffect, useState, memo } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

function SelectChargeTypeComponent({
	initialValue,
	showLabel = true,
	disabled = false,
	filter,
	control,
	name = 'chargeType',
	required = false,
	error,
	helperText = '',
}: {
	disabled?: boolean;
	showLabel?: boolean;
	initialValue?: ChargeType;
	filter?: { names?: string[]; ids?: number[] };
	control: any;
	name?: string;
	required?: boolean;
	error?: any;
	helperText?: string;
}) {
	const classes = useStyles();
	const chargeTypes: ChargeType[] = Object.values(ChargeType);
	const [options, setOptions] = useState<ChargeType[]>(chargeTypes);

	useEffect(() => {
		if (filter) {
			if (filter.names) setOptions(chargeTypes.filter((d: ChargeType) => (filter.names ? filter.names.includes(d) : true)));
		}
	}, [filter]);

	return (
		<FormControl className={classes.formControl} disabled={disabled}>
			{showLabel && (
				<InputLabel shrink id="select-charge-type-label">
					Charge Type
				</InputLabel>
			)}
			<Controller
				render={({ field }) => (
					<Select {...field} labelId="select-charge-type-label" placeholder="Please select" error={!!error} variant="outlined">
						{options.map((i: ChargeType) => (
							<MenuItem value={i} key={i}>
								{i}
							</MenuItem>
						))}
					</Select>
				)}
				name={name}
				control={control}
				rules={{ required }}
				defaultValue={initialValue || ''}
			/>
			{helperText !== '' && (
				<FormHelperText style={{ paddingLeft: 15 }} error>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
}

export default memo(SelectChargeTypeComponent);
