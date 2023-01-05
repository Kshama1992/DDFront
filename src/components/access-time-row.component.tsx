import React from 'react';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Divider from '@mui/material/Divider';
import CheckboxComponent from '@forms/elements/checkbox.component';
import AccessHFormValues from '@forms/interface/access-h-form-values.interface';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		timeLineSM: {
			'& .MuiTypography-root': {
				fontSize: 12,
				paddingLeft: 0,
				paddingTop: 5,
			},
			'& .MuiOutlinedInput-root': {
				maxWidth: 125,
				fontSize: 11,
				marginTop: -3,
				'& input': {
					padding: '12px 10px',
					fontSize: 11,
				},
			},
			'& .MuiFormControl-root': {
				marginTop: 7,
			},
			'& .MuiButtonBase-root': {
				padding: 3,
			},
		},
		timeLine: {},
		timeName: {
			paddingLeft: 40,
			paddingTop: 30,
			[theme.breakpoints.down('md')]: {
				display: 'inline-block',
				textAlign: 'center',
				width: '100%',
				padding: 0,
			},
		},
		timeDivider: {
			marginTop: 15,
			marginBottom: -15,
		},
	})
);

function AccessTimeRowComponent({
	field,
	index,
	control,
	watch,
	disabled = false,
	size = 'lg',
	timeFormat = 'hh:mm A',
	arrName = 'accessCustomData',
}: {
	field: AccessHFormValues;
	index: number;
	control: any;
	disabled?: boolean;
	watch: any;
	timeFormat?: any;
	size?: 'lg' | 'sm';
	arrName?: string;
}) {
	const classes = useStyles({});
	const [open] = watch([`${arrName}.${index}.open`]);

	return (
		<Grid item xs={12} className={size === 'sm' ? classes.timeLineSM : classes.timeLine}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<FormControl fullWidth style={{ padding: 0, margin: 0 }}>
						<InputLabel shrink />
						<Typography className={classes.timeName}>{field.weekday}</Typography>
						<Controller
							render={({ field: thisField }) => (
								<TextField {...thisField} fullWidth style={{ opacity: 0 }} disabled={disabled} type="hidden" />
							)}
							name={`${arrName}.${index}.weekday`}
							control={control}
							defaultValue={field.weekday}
						/>
						<Controller
							render={({ field: thisField }) => (
								<TextField {...thisField} fullWidth type="hidden" disabled={disabled} style={{ opacity: 0 }} />
							)}
							name={`${arrName}.${index}.id`}
							control={control}
						/>
					</FormControl>
				</Grid>

				<Grid item xs={6} md={3}>
					<Controller
						render={({ field: thisField }) => (
							<TimePicker
								{...thisField}
								renderInput={(props) => (
									<TextField {...props} disabled={!open || disabled} label={size === 'sm' ? '' : 'Opening Time'} />
								)}
								inputFormat={timeFormat}
							/>
						)}
						name={`${arrName}.${index}.accessHoursFrom`}
						control={control}
						defaultValue={field.accessHoursFrom}
					/>
				</Grid>

				<Grid item xs={6} md={3}>
					<Controller
						render={({ field: thisField }) => (
							<TimePicker
								{...thisField}
								renderInput={(props: any) => <TextField {...props} inputVariant="outlined" />}
								inputFormat={timeFormat}
								disabled={!open || disabled}
								label={size === 'sm' ? '' : 'Closing Time'}
							/>
						)}
						name={`${arrName}.${index}.accessHoursTo`}
						control={control}
						defaultValue={field.accessHoursTo}
					/>
				</Grid>

				<Grid item xs={12} md={3} style={{ paddingTop: 30 }}>
					<CheckboxComponent disabled={disabled} control={control} name={`${arrName}.${index}.open`} label="Open" />
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.timeDivider}>
				<Divider light />
			</Grid>
		</Grid>
	);
}

export default AccessTimeRowComponent;
