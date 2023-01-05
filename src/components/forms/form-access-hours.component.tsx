import React, { memo, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import CheckboxComponent from '@forms/elements/checkbox.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		switch: {
			marginLeft: 15,
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 11,
		},
		checkbox: {
			'&.Mui-disabled': {
				color: 'rgba(0, 0, 0, 0.26)',
				'& .MuiIconButton-label, & .MuiTypography-root': {
					color: 'rgba(0, 0, 0, 0.26)',
				},
			},
			'& .MuiTypography-root': {
				fontSize: '11px !important',
				textTransform: 'none !important',
			},
		},
		switchLabel: {
			marginLeft: 0,
		},
		timeField: {
			maxWidth: 100,
		},
		hoursField: {
			maxWidth: 60,
			fontSize: 11,
			marginTop: -3,
			'& input': {
				padding: '12px 10px',
				fontSize: 11,
			},
			[theme.breakpoints.down('md')]: {
				margin: 0,
			},
		},
		monthlyCheckBox: {
			marginBottom: -10,
			[theme.breakpoints.down('md')]: {
				marginLeft: -10,
				marginBottom: 0,
			},
		},
		title: {
			textTransform: 'uppercase',
			marginBottom: 5,
			fontSize: 13,
		},
	})
);

function FormAccessHoursComponent({
	index = 0,
	watch,
	showAdditionalHours = false,
	showUsedHours = false,
	control,
	defaultValues,
	disabled = false,
	isDirty = false,
	setValue,
	setError,
	clearErrors,
	errors,
}: {
	index?: number;
	control: any;
	watch: any;
	disabled?: boolean;
	isDirty?: boolean;
	showUsedHours?: boolean;
	showAdditionalHours?: boolean;
	defaultValues?: any;
	setValue: (name: string, value: unknown, config?: any) => void;
	setError?: any;
	clearErrors?: any;
	errors?: any;
}) {
	const [, setResetArray] = useState<boolean>(true);

	const classes = useStyles({});

	const recurringMonth = watch(`creditHours.${index}.recurringMonth`);
	const recurringForever: boolean = watch(`creditHours.${index}.recurringForever`);
	const notRecurring: boolean = watch(`creditHours.${index}.notRecurring`);
	const rollover: boolean = watch(`creditHours.${index}.rollover`);
	const type: string = watch(`creditHours.${index}.type`);

	useEffect(() => {
		if (!isDirty) return;

		if (recurringForever) {
			setValue(`creditHours[${index}].recurringMonth`, 0);
			setValue(`creditHours[${index}].notRecurring`, false);
			setValue(`creditHours[${index}].rollover`, false);
		}
	}, [recurringForever]);

	useEffect(() => {
		if (!isDirty) return;

		if (notRecurring) {
			setValue(`creditHours[${index}].recurringForever`, false);
			setValue(`creditHours[${index}].rollover`, false);
			setValue(`creditHours[${index}].recurringMonth`, 0);
		} else {
			setValue(`creditHours[${index}].recurringMonth`, 0);
		}
	}, [notRecurring]);

	useEffect(() => {
		if (!isDirty) return;

		if (recurringMonth) {
			setValue(`creditHours[${index}].recurringForever`, false);
			setValue(`creditHours[${index}].notRecurring`, false);
		}
	}, [recurringMonth]);

	useEffect(() => {
		if (!isDirty) return;
		if (!notRecurring && !recurringForever && !rollover && recurringMonth === 0) {
			setError(`creditHoursError_${type.replace('-', '')}`, { type: 'custom', message: `Please select recurring options for ${type} hours` });
		} else {
			clearErrors(`creditHoursError_${type.replace('-', '')}`);
		}
	}, [recurringMonth, notRecurring, recurringForever, rollover]);

	useEffect(() => {
		setResetArray(false);
	}, [defaultValues]);

	const handleMonthCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;
		setValue(`creditHours[${index}].recurringMonth`, Number(checked));
	};

	const handleGivenHoursBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (!event.target) return;
		const { value } = event.target as HTMLInputElement;
		if (value === '') setValue(`creditHours[${index}].given`, '0');
	};

	return (
		<>
			<Typography variant="subtitle2" className={classes.title}>
				{defaultValues?.type} room hours
			</Typography>

			<Controller render={({ field }) => <Input {...field} type="hidden" />} name={`creditHours[${index}].type`} control={control} />

			<Controller render={({ field }) => <Input {...field} type="hidden" />} name={`creditHours[${index}].id`} control={control} />

			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Typography variant="body1" className={classes.label}>
						Hours given <br /> this month:
					</Typography>
				</Grid>
				<Grid item xs={12} md={3}>
					<Controller
						render={({ field }) => (
							<TextField
								variant="outlined"
								{...field}
								onBlur={handleGivenHoursBlur}
								className={classes.hoursField}
								disabled={disabled}
							/>
						)}
						name={`creditHours[${index}].given`}
						control={control}
					/>
				</Grid>
				{showUsedHours && (
					<>
						<Grid item xs={12} md={3}>
							<Typography variant="body1" className={classes.label}>
								Hours used <br /> this month:
							</Typography>
						</Grid>
						<Grid item xs={12} md={3}>
							<Controller
								render={({ field }) => <TextField {...field} variant="outlined" className={classes.hoursField} disabled={disabled} />}
								name={`creditHours[${index}].used`}
								control={control}
							/>
						</Grid>
					</>
				)}
			</Grid>

			<Grid container spacing={3} style={{ marginTop: 0 }}>
				<Grid item xs={12} lg={3}>
					<CheckboxComponent disabled={disabled} control={control} name={`creditHours[${index}].notRecurring`} label="Not Recurring" />
				</Grid>

				<Grid item xs={12} md={5}>
					<Grid container spacing={1} alignItems="flex-end" style={{ marginTop: -11 }}>
						<Grid item>
							<Checkbox
								checked={recurringMonth > 0}
								name="checkedB"
								color="primary"
								onChange={handleMonthCheck}
								className={classes.monthlyCheckBox}
								disabled={disabled}
								defaultValue="0"
							/>
						</Grid>
						<Grid item>
							<Controller
								render={({ field }) => <TextField variant="standard" {...field} className={classes.hoursField} disabled={disabled} />}
								name={`creditHours[${index}].recurringMonth`}
								control={control}
							/>
						</Grid>
						<Grid item style={{ paddingBottom: 10, fontWeight: 300, fontSize: 12, color: '#333' }}>
							Months
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} lg={4}>
					<CheckboxComponent
						control={control}
						disabled={disabled}
						name={`creditHours[${index}].recurringForever`}
						label="Recurring Forever"
					/>
				</Grid>

				<Grid item xs={12} lg={3} style={{ marginTop: 0, paddingTop: 0 }}>
					<CheckboxComponent
						control={control}
						name={`creditHours[${index}].rollover`}
						label="Rollover"
						disabled={!!notRecurring || disabled}
					/>
				</Grid>
			</Grid>

			{showAdditionalHours && (
				<Grid container spacing={3}>
					<Grid item>
						<Typography className={classes.label}>Additional Hours:</Typography>
					</Grid>
					<Grid item>
						<Controller
							render={({ field }) => (
								<Input
									{...field}
									style={{ width: 150 }}
									className={classes.hoursField}
									disabled={disabled}
									endAdornment={<InputAdornment position="end">/ hr.</InputAdornment>}
								/>
							)}
							name={`creditHours[${index}].additionalHours`}
							control={control}
						/>
					</Grid>
				</Grid>
			)}
			{errors && errors[`creditHoursError_${type.replace('-', '')}`] && (
				<Typography style={{ color: 'red', fontSize: 14 }}>{errors[`creditHoursError_${type.replace('-', '')}`].message}</Typography>
			)}
			<Divider style={{ marginBottom: 25, marginTop: 15 }} />
		</>
	);
}

export default memo(
	FormAccessHoursComponent,
	(prevProps: any, nextProps: any) => prevProps.formState && prevProps.formState.dirty === nextProps.formState.dirty
);
