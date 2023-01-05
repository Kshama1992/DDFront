import React, { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs, extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import { Controller, useForm } from 'react-hook-form';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import ReservationStatus from 'dd-common-blocks/dist/type/ReservationStatus';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SelectTimeZoneComponent from '@forms/elements/select-time-zone.component';
import SelectDateComponent from '@forms/elements/select-date.component';
import SelectReservationTimeComponent from '@forms/elements/select-reservation-time.component';
import { SnackBarContext } from '@context/snack-bar.context';
import ReservationService from '@service/reservation.service';
import LoadingButton from '@forms/elements/loading-button.component';
import ReservationFormValuesInterface from '@forms/interface/reservation-form-values.interface';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import InvoiceService from '@service/invoice.service';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiFormLabel-root, & .MuiFormControlLabel-label': {
				textTransform: 'uppercase',
				fontSize: 12,
				fontWeight: 500,
				color: theme.palette.text.primary,
			},
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
		},
		formControl: {
			width: '100%',
		},
		container: {
			padding: '0 35px 25px 35px',
		},
	})
);

export default function FormReservationComponent({
	reservation,
	onSave,
	onCancel,
}: {
	reservation: ReservationFormValuesInterface;
	onSave: (data: InvoiceInterface) => any;
	onCancel?: () => any;
}) {
	const classes = useStyles({});
	const invoiceService = new InvoiceService();
	const reservationService = new ReservationService();
	const { showSnackBar } = useContext(SnackBarContext);
	const isUSA = reservation.tzLocation.indexOf('America') !== -1;
	const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';
	const [durationHours, setDurationHours] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
	const [startTime, setStartTime] = useState<Dayjs | undefined>(dayjs(reservation.hoursFrom).tz(reservation.tzLocation));
	const [endTime, setEndTime] = useState<Dayjs | undefined>(dayjs(reservation.hoursTo).tz(reservation.tzLocation));
	const [showSelectDate, setShowSelectDate] = useState<boolean>(false);
	const [startTimeVisible, setStartTimeVisible] = useState(false);
	const [date, setDate] = useState<string | undefined>(dayjs(reservation.hoursFrom).tz(reservation.tzLocation).format());

	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			...reservation,
			hoursFrom: dayjs(reservation.hoursFrom).tz(reservation.tzLocation).format(timeFormat),
			hoursTo: dayjs(reservation.hoursTo).tz(reservation.tzLocation).format(timeFormat),
			date: dayjs(reservation.hoursFrom).tz(reservation.tzLocation).format('D MMM YYYY'),
		} || {
			status: ReservationStatus.ACTIVE,
			chargeType: ChargeType.HOURLY,
			tzUser: 'America/New_York',
			tzLocation: 'America/New_York',
			hoursFrom: new Date().toString(),
			hoursTo: dayjs().add(1, 'year').toString(),
			date: dayjs().format('D MMM YYYY'),
		},
	});

	useEffect(() => {
		if (reservation.space && [ChargeType.HOURLY].includes(reservation.space.chargeType)) {
			setDurationHours(dayjs(reservation.hoursTo).diff(dayjs(reservation.hoursFrom), 'hour'));
		}
	}, [reservation]);

	const save = async (formData: any) => {
		if (!reservation.space) return;

		if (!startTime || !endTime) {
			showSnackBar('Please select start and end time');
			return;
		}

		let pStart = startTime.clone();
		let pEnd = endTime.clone();

		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.EVENT) {
			if (!reservation.space.eventData || typeof reservation.space.eventData.date === 'undefined') throw new Error('Event have no time data');
			const evDate = dayjs.tz(reservation.space.eventData.date, reservation.space.venue.tzId);
			const evEndTime = dayjs(reservation.space.eventData.accessHoursTo as string, 'HH:mm:ss');
			const evStartTime = dayjs(reservation.space.eventData.accessHoursFrom as string, 'HH:mm:ss');

			pEnd = evDate.hour(evEndTime.get('hour')).minute(evEndTime.get('minute'));

			pStart = evDate.hour(evStartTime.get('hour')).minute(evStartTime.get('minute'));
		}

		if ([ChargeType.HOURLY].includes(reservation.space.chargeType)) {
			if (startTime && endTime) {
				pStart = startTime;
				pEnd = endTime;

				const givenRoundHours = endTime.diff(startTime, 'h', true);
				if (givenRoundHours < reservation.space.roundHours) {
					showSnackBar(`Minimum booking slot for this package is ${reservation.space.roundHours} Hours`);
					return;
				}
			} else {
				showSnackBar('Please select date and time');
				return;
			}
		}

		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.DAILY) {
			pEnd = pStart.endOf('day');
			pStart = pStart.startOf('day');
		}
		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.MONTHLY) {
			pStart = pStart.startOf('day');
			pEnd = pStart.add(1, 'year').endOf('day');
		}
		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.WEEKLY) {
			pEnd = pStart.add(1, 'week').endOf('day');
			pStart = pStart.startOf('day');
		}

		setIsSaving(true);
		try {
			const newRes = await reservationService.save({ ...formData, hoursFrom: pStart.format(), hoursTo: pEnd.format() }, reservation.id);
			showSnackBar('Reservation saved!');
			if (onSave) {
				if (newRes.invoiceId) onSave(await invoiceService.single(newRes.invoiceId));
				else onSave(newRes.invoice);
			}
		} catch (e) {
			showSnackBar(e.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleSelectDate = (d: string) => {
		if (!reservation.space) return;

		setDate(d);
		setValue('date', dayjs(d).format('D MMM YYYY'));
		setShowSelectDate(false);

		if ([SpaceTypeLogicType.DAILY, SpaceTypeLogicType.MONTHLY, SpaceTypeLogicType.WEEKLY].includes(reservation.space.spaceType.logicType)) {
			setStartTime(dayjs(d).startOf('day'));
		}

		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.DAILY) {
			setEndTime(dayjs(d).endOf('day'));
		}

		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.MONTHLY) {
			setEndTime(dayjs(d).add(1, 'year').startOf('day'));
		}

		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.WEEKLY) {
			setEndTime(dayjs(d).add(1, 'week').startOf('day'));
		}

		if (reservation.space.spaceType.logicType === SpaceTypeLogicType.EVENT) {
			if (!reservation.space.eventData || typeof reservation.space.eventData.date === 'undefined') throw new Error('Event have no time data');
			const evDate = dayjs.tz(reservation.space.eventData.date, reservation.space.venue.tzId);
			const evEndTime = dayjs(reservation.space.eventData.accessHoursTo as string, 'HH:mm:ss');
			const evStartTime = dayjs(reservation.space.eventData.accessHoursFrom as string, 'HH:mm:ss');

			setEndTime(evDate.hour(evEndTime.get('hour')).minute(evEndTime.get('minute')));
			setStartTime(evDate.hour(evStartTime.get('hour')).minute(evStartTime.get('minute')));
		}

		if ([ChargeType.HOURLY].includes(reservation.space.chargeType)) {
			setStartTime(undefined);
			setEndTime(undefined);
			setValue('hoursFrom', '', { shouldValidate: true });
			setValue('hoursTo', '', { shouldValidate: true });
		}
	};

	const handleStartTime = (value: string) => {
		const val = dayjs(value).tz(reservation.tzLocation);
		setStartTime(val);
		setValue('hoursFrom', val.format(timeFormat), { shouldValidate: true });
		if (reservation.space && [ChargeType.HOURLY].includes(reservation.space.chargeType)) {
			setEndTime(val.add(durationHours, 'hour'));
			setValue('hoursTo', val.add(durationHours, 'hour').format(timeFormat), { shouldValidate: true });
		}
		setStartTimeVisible(false);
	};

	const handleDateClose = () => setShowSelectDate(false);

	return (
		<form onSubmit={handleSubmit(save)} className={classes.root}>
			<Grid container spacing={3} className={classes.container}>
				<Grid item xs={12} md={6}>
					<FormControl className={classes.formControl}>
						<Controller
							render={({ field }) => <SelectTimeZoneComponent {...field} error={!!errors.tzUser} label="User time zone" />}
							name="tzUser"
							control={control}
						/>
					</FormControl>
				</Grid>

				<Grid item xs={12} md={6}>
					<FormControl className={classes.formControl}>
						<Controller
							render={({ field }) => (
								<SelectTimeZoneComponent {...field} error={!!errors.tzLocation} label="Venue time zone" disabled />
							)}
							name="tzLocation"
							control={control}
						/>
					</FormControl>
				</Grid>

				{![SpaceTypeLogicType.EVENT].includes(reservation.space?.spaceType?.logicType) && (
					<>
						<Grid container spacing={3} style={{ padding: '0 24px 0' }}>
							<Grid item xs={12} md={6}>
								<FormControl className={classes.formControl}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												InputLabelProps={{ shrink: true }}
												label="Date"
												variant="outlined"
												onClick={() => {
													setShowSelectDate(true);
												}}
											/>
										)}
										name="date"
										control={control}
									/>
								</FormControl>
							</Grid>
						</Grid>
					</>
				)}

				<Grid item xs={12} md={6}>
					{[ChargeType.HOURLY].includes(reservation.space!.chargeType) && (
						<FormControl className={classes.formControl}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										InputLabelProps={{ shrink: true }}
										label="Start time"
										variant="outlined"
										onClick={() => setStartTimeVisible(true)}
									/>
								)}
								name="hoursFrom"
								control={control}
							/>
						</FormControl>
					)}
				</Grid>

				<Grid item xs={12} md={6}>
					{[ChargeType.HOURLY].includes(reservation.space!.chargeType) && (
						<FormControl className={classes.formControl}>
							<Controller
								render={({ field }) => (
									<TextField {...field} InputLabelProps={{ shrink: true }} label="End time" variant="outlined" disabled />
								)}
								name="hoursTo"
								control={control}
							/>
						</FormControl>
					)}
				</Grid>

				<Grid item xs={12} style={{ textAlign: 'center' }}>
					<Button
						variant="contained"
						color="secondary"
						type="button"
						style={{ marginRight: 15 }}
						onClick={() => (onCancel ? onCancel() : {})}
					>
						Cancel
					</Button>
					<LoadingButton isLoading={isSaving} text="Save reservation" variant="contained" color="primary" type="submit" />
				</Grid>
			</Grid>

			<Dialog open={showSelectDate} onClose={handleDateClose}>
				<SelectDateComponent
					selectedDate={date}
					space={reservation.space}
					tzId={reservation.tzLocation}
					userId={Number(reservation.userId)}
					onDateSelected={handleSelectDate}
				/>
			</Dialog>

			<Dialog open={startTimeVisible} onClose={() => setStartTimeVisible(false)}>
				<DialogContent>
					<SelectReservationTimeComponent
						space={reservation.space}
						tzId={reservation.tzLocation}
						date={date}
						onTimeSelected={handleStartTime}
						userId={Number(reservation.userId)}
						excludeReservationId={Number(reservation.id)}
					/>
				</DialogContent>
			</Dialog>
		</form>
	);
}
