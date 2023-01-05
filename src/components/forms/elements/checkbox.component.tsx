import React from 'react';
import { Controller } from 'react-hook-form';
import MUICheckBox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';

const useStyles = makeStyles(() =>
	createStyles({
		checkbox: {
			'&.Mui-disabled': {
				color: 'rgba(0, 0, 0, 0.26)',
				'& .MuiIconButton-label, & .MuiTypography-root': {
					color: 'rgba(0, 0, 0, 0.26)',
				},
			},
			'& .MuiTypography-root': {
				fontSize: '12px !important',
				textTransform: 'none !important',
			},
		},
	})
);

export default function CheckboxComponent({
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
				root: classes.checkbox,
			}}
			disabled={disabled}
			control={
				<Controller
					name={name}
					control={control}
					render={({ field }) => <MUICheckBox {...field} checked={field.value} disabled={disabled} color="primary" />}
				/>
			}
			label={label}
			style={style}
		/>
	);
}
