import { Controller } from 'react-hook-form';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const useStyles = makeStyles(() =>
	createStyles({
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
		switchLabel: {
			marginLeft: 0,
			fontSize: 12,
		},
	})
);

export default function SwitchComponent({
	control,
	name,
	label,
	style = {},
	disabled = false,
}: {
	control: any;
	name: string;
	label: string;
	disabled?: boolean;
	style?: any;
}) {
	const classes = useStyles({});

	return (
		<FormControlLabel
			classes={{
				labelPlacementStart: classes.switchLabel,
				label: classes.label,
			}}
			disabled={disabled}
			control={
				<Controller
					name={name}
					control={control}
					render={({ field }) => <Switch {...field} checked={field.value} disabled={disabled} color="primary" />}
				/>
			}
			label={label}
			labelPlacement="start"
			style={style}
		/>
	);
}
