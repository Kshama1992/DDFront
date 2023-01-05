// @ts-nocheck
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TableContainer from '@mui/material/TableContainer';
import SaveIcon from '@mui/icons-material/Save';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ReplayIcon from '@mui/icons-material/Replay';
import TableBody from '@mui/material/TableBody';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs, { Dayjs, extend } from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import NumberFormat from 'react-number-format';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import InvoiceStatusInterface from 'dd-common-blocks/dist/interface/invoice-status.interface';
import InvoiceStatus from 'dd-common-blocks/dist/type/InvoiceStatus';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import FormInvoiceItemComponent from '@forms/form-invoice-item.component';
import { DEFAULT_CURRENCY } from '@core/config';
import DialogContent from '@mui/material/DialogContent';
import {
	getCurrencySymbol,
	getInvoiceNumber,
	getInvoicePayDateString,
	getInvoiceProcessingDateString,
	getInvoiceSubTotalString,
	SecondsToTimeHelper,
} from 'dd-common-blocks';
import InvoiceService from '@service/invoice.service';
import InvoiceItemInterface from 'dd-common-blocks/dist/interface/invoice-item.interface';
import { dateWithTz } from '@helpers/space/space-hours.helper';
import InvoiceFormValuesInterface from '@forms/interface/invoice-form-values.interface';
import FormInvoiceStyles from './styles/form-invoice.styles';

extend(dayjsDuration);
extend(dayjsutc);
extend(dayjstimezone);

const MuiCurrencyFormat = ({ onChange, value, ...rest }: any) => {
	const [currency, setCurrency] = useState(value);
	return (
		<NumberFormat
			customInput={TextField}
			{...rest}
			value={currency}
			fullWidth
			decimalScale={2}
			allowNegative={false}
			fixedDecimalScale
			decimalSeparator=","
			onValueChange={(target) => {
				setCurrency(target.floatValue);
				onChange(target.floatValue ? target.floatValue : 0);
			}}
			isNumericString
			prefix="$ "
		/>
	);
};

function ReservationDuration({ reservation }: { reservation: ReservationInterface }) {
	const resTz = reservation.tzLocation;
	const isUSA = resTz.indexOf('America') !== -1;
	const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';
	const startTimeStr = dateWithTz(reservation.hoursFrom, resTz).format(`D MMMM YYYY ${timeFormat}`);
	let endTimeStr = 'Is Ongoing';

	if (reservation.hoursTo) {
		endTimeStr = dateWithTz(reservation.hoursTo, resTz).format(`D MMMM YYYY ${timeFormat}`);
	}

	return (
		<>
			{startTimeStr} - {endTimeStr}
		</>
	);
}

function FormInvoiceComponent({
	initialValues,
	user,
	handleClose,
	doRefresh,
}: {
	initialValues?: InvoiceFormValuesInterface;
	user: UserInterface;
	handleClose: () => any;
	doRefresh: () => any;
}) {
	const classes = FormInvoiceStyles();

	const invoiceService = new InvoiceService();
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [refundOptionsVisible, setRefundOptionsVisible] = useState<boolean>(false);
	const [editItemVisible, setEditItemVisible] = useState<boolean>(false);
	const [changeDateVisible, setChangeDateVisible] = useState<boolean>(false);
	const [processDate, setProcessDate] = useState<Dayjs | null>(dayjs(initialValues?.processDate));

	const [invoiceStatuses, setInvoiceStatuses] = useState<InvoiceStatusInterface[]>([]);

	const loadInvoiceStatuses = useCallback(async () => {
		try {
			const [items] = await invoiceService.statusList();
			setInvoiceStatuses(items);
		} catch (e) {
			console.error(e as Error);
		}
	}, []);

	useEffect(() => {
		loadInvoiceStatuses().then();
	}, []);

	if (initialValues) {
		// eslint-disable-next-line no-param-reassign
		initialValues.refundAmount = (Number(initialValues?.subTotal) + Number(initialValues?.tax)).toFixed(2);
	}

	const defaultInvoiceData: InvoiceFormValuesInterface = {
		paid: false,
		userId: 0,
		paidAmount: 0,
		subTotal: 0,
		tax: 0,
		items: [],
		invoiceNumber: 0,
		reservationId: 0,
		refundAmount: 0.0,
		refundNote: '',
		createdAt: new Date(),
		updatedAt: new Date(),
		invoiceStatusId: 0,
	};

	const { handleSubmit, control, reset, getValues } = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : defaultInvoiceData,
	});

	const { fields: items, append: appendItem } = useFieldArray({
		control,
		name: 'items',
	});

	let spaceCurrency = !initialValues || !initialValues.currency ? DEFAULT_CURRENCY.code : initialValues?.currency;
	if (initialValues && initialValues.stripeInvoice) spaceCurrency = initialValues.stripeInvoice.currency.toUpperCase();

	const convertCurrency = (price: any) => {
		if (!price) return `${getCurrencySymbol(spaceCurrency)} 0`;
		return `${getCurrencySymbol(spaceCurrency)}${price.toFixed(2)}`;
	};

	useEffect(() => {
		if (initialValues) {
			reset(initialValues);

			// const tzUser = initialValues.reservation?.tzLocation;
			// const isUSA = tzUser && tzUser.indexOf('America') !== -1;
			// setTimeFormat(isUSA ? 'hh:mm A' : 'HH:mm');
		}
		if (initialValues && initialValues.processDate) {
			setProcessDate(dayjs(initialValues.processDate));
		}
	}, [initialValues]);

	const costProgress = initialValues && initialValues.invoiceStatus && initialValues.invoiceStatus.name === 'Upcoming-Hours' ? 'In Progress' : null;

	const invoicePaid = async () => {
		try {
			setIsSaving(true);
			const paidStatus = invoiceStatuses.find((is: InvoiceStatusInterface) => is.name === InvoiceStatus.PAID);
			if (paidStatus) {
				const newInvoice = await invoiceService.changeStatus(initialValues?.id, { statusId: paidStatus.id });
				reset(newInvoice);
			}
			doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const invoiceVoid = async () => {
		try {
			setIsSaving(true);
			const voidStatus = invoiceStatuses.find((is: InvoiceStatusInterface) => is.name === InvoiceStatus.VOID);
			if (voidStatus) {
				const newInv = await invoiceService.changeStatus(initialValues?.id, { statusId: voidStatus.id });
				reset(newInv);
			}
			doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const invoiceSend = async () => {
		try {
			setIsSaving(true);
			const sendStatus = invoiceStatuses.find((is: InvoiceStatusInterface) => is.name === InvoiceStatus.SENT);
			if (sendStatus) {
				const newInv = await invoiceService.changeStatus(initialValues?.id, { statusId: sendStatus.id });
				reset(newInv);
			}
			doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const invoiceRefund = async () => {
		try {
			setIsSaving(true);
			const { refundAmount, refundNote } = getValues();

			const refundNum = parseFloat(String(refundAmount)) * 100;

			const refundStatus = invoiceStatuses.find((is: InvoiceStatusInterface) => is.name === InvoiceStatus.REFUND);
			if (refundStatus) {
				const newInv = await invoiceService.changeStatus(initialValues?.id, {
					statusId: refundStatus.id,
					refundAmount: refundNum,
					refundNote: String(refundNote),
				});
				reset(newInv);
			}

			setRefundOptionsVisible(false);
			doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const save = async (formData: InvoiceInterface) => {
		try {
			setIsSaving(true);
			const sendStatus = invoiceStatuses.find((is: InvoiceStatusInterface) => is.name === 'Sent');

			if (!sendStatus) return;

			const cloneData = formData;
			// @ts-ignore
			cloneData.items = items.map((i) => {
				// @ts-ignore
				const { id, ...withoutId } = i as InvoiceItemInterface;
				if (typeof id !== 'number') {
					return withoutId;
				}
				return i;
			});

			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			await invoiceService.save(
				itemId
					? cloneData
					: {
							...cloneData,
							createdById: String(authBody?.id),
							userId: String(user.id),
							startDate: dayjs().format(),
							endDate: dayjs().format(),
					  },
				itemId
			);

			showSnackBar('Invoice saved!');
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
			doRefresh();
		} finally {
			setIsSaving(false);
			doRefresh();
		}
	};

	const handleDateChange = async (date: Dayjs | null) => {
		setProcessDate(date.add(6, 'hours'));
		try {
			if (date) {
				const newInv = await invoiceService.save({ ...initialValues, processDate: date.format() }, String(initialValues?.id));
				reset(newInv);
			}
			setChangeDateVisible(false);
			doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit((d) => save(d as InvoiceInterface))}>
				<Grid container spacing={3}>
					<Grid item xs={10}>
						{(isSuperAdmin || isBrandAdmin) && ['Upcoming', 'Upcoming-Hours'].includes(initialValues?.invoiceStatus?.name || '') && (
							<Button className={classes.topBtn} onClick={() => setChangeDateVisible(true)} startIcon={<CalendarTodayIcon />}>
								Change billing date
							</Button>
						)}

						{(isBrandAdmin || isSuperAdmin) && (
							<>
								{initialValues?.invoiceStatus?.name !== 'Paid' && (
									<Button className={classes.topBtn} startIcon={<SaveIcon />} type="submit">
										Save Invoice
									</Button>
								)}

								{initialValues?.id && (
									<>
										{!['Paid', 'Sent', 'Void'].includes(initialValues?.invoiceStatus?.name || '') && (
											<Button className={classes.topBtn} startIcon={<MailOutlineIcon />} onClick={invoiceSend}>
												Send Invoice
											</Button>
										)}
										{!['Paid', 'Void'].includes(initialValues?.invoiceStatus?.name || '') && (
											<Button className={classes.topBtn} startIcon={<CheckIcon />} onClick={invoicePaid}>
												Mark as Paid
											</Button>
										)}
										{initialValues?.invoiceStatus?.name === 'Paid' && (
											<Button
												className={classes.topBtn}
												startIcon={<ReplayIcon />}
												onClick={() => setRefundOptionsVisible(!refundOptionsVisible)}
											>
												{refundOptionsVisible ? 'Close refund options' : 'Refund'}
											</Button>
										)}
										{!['Paid', 'Void'].includes(initialValues?.invoiceStatus?.name || '') && (
											<Button className={classes.topBtn} startIcon={<CloseIcon />} onClick={invoiceVoid}>
												Void Invoice
											</Button>
										)}
									</>
								)}

								{/* <Button className={classes.topBtn} startIcon={<PrintIcon />}> */}
								{/*	Print */}
								{/* </Button> */}
							</>
						)}
					</Grid>

					<Grid item xs={2}>
						<IconButton aria-label="delete" className={classes.closeBtn} onClick={handleClose} size="large">
							<CloseIcon />
						</IconButton>
					</Grid>

					{refundOptionsVisible && (
						<Grid item xs={12}>
							<hr style={{ width: '100%' }} />

							<Grid container spacing={3}>
								<Grid item xs={8}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												label="Refund note"
												InputLabelProps={{ shrink: true }}
												variant="outlined"
											/>
										)}
										name="refundNote"
										control={control}
										rules={{ required: true }}
									/>
								</Grid>

								<Grid item xs={2}>
									<Controller
										render={({ field }) => (
											<MuiCurrencyFormat
												{...field}
												label="Refund Amount"
												variant="outlined"
												disabled={initialValues?.subTotal === 0}
											/>
										)}
										name="refundAmount"
										control={control}
										defaultValue={initialValues?.refundAmount || 0}
									/>
								</Grid>

								<Grid item xs={2} style={{ paddingTop: 15 }}>
									<Button variant="contained" className={classes.topBtn} startIcon={<ReplayIcon />} onClick={invoiceRefund}>
										Refund
									</Button>
								</Grid>
							</Grid>
						</Grid>
					)}

					<hr style={{ width: '100%' }} />

					{user && (
						<>
							<Grid item md={7} xs={12}>
								<Typography className={classes.greyText}>TO</Typography>
								<Typography>
									{user.firstname} {user.lastname}
								</Typography>
								<br />

								{initialValues && initialValues.venue && (
									<>
										<Typography className={classes.greyText}>VENUE</Typography>
										<Typography dangerouslySetInnerHTML={{ __html: String(initialValues.venue.name) }} />
										<Typography dangerouslySetInnerHTML={{ __html: String(initialValues.venue.address) }} />
										{initialValues.venue.address2 && (
											<Typography dangerouslySetInnerHTML={{ __html: String(initialValues.venue.address2) }} />
										)}
									</>
								)}
							</Grid>
							<Grid item xs={12} md={5}>
								<img
									className={classes.brandLogo}
									src={
										user.brand?.logo
											? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${user.brand.logo.url}`
											: '/images/header/header_logo_user.png'
									}
									alt={user.brand!.name}
								/>

								{initialValues && initialValues?.payDate && (
									<Typography>
										Billing Date:{' '}
										<span className={classes.blueText}>{getInvoicePayDateString(initialValues as InvoiceInterface)}</span>
									</Typography>
								)}

								{initialValues && initialValues?.processDate && (
									<Typography>
										Invoice Date:{' '}
										<span className={classes.blueText}>{getInvoiceProcessingDateString(initialValues as InvoiceInterface)}</span>
									</Typography>
								)}

								<Typography>
									Invoice Number: <span className={classes.blueText}> {getInvoiceNumber(initialValues as InvoiceInterface)}</span>
								</Typography>
							</Grid>
							<hr style={{ width: '100%' }} />
						</>
					)}

					<Grid item xs={12}>
						<>
							{initialValues && initialValues.space && (
								<>
									<img
										className={classes.historyDetailsImage}
										src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${
											initialValues.space.photos.length
												? initialValues.space.photos[0].url
												: initialValues.venue!.photos![0].url
										}`}
										alt={initialValues.space.name}
									/>

									<Typography
										dangerouslySetInnerHTML={{ __html: String(initialValues?.space?.name) }}
										className={classes.historyDetailsName}
									/>

									<Typography
										dangerouslySetInnerHTML={{ __html: String(initialValues?.venue?.address) }}
										className={classes.historyDetailsAddress}
									/>

									<div className={classes.historyDetailsBooked}>
										<Typography className={classes.historyDetailsBookedText}>
											{initialValues.space.spaceType ? initialValues.space.spaceType.name : ''}{' '}
										</Typography>

										{initialValues.reservation && (
											<Typography className={classes.historyDetailsBookedText}>
												{initialValues.processDate && initialValues.reservation.bookedAt ? (
													<>
														<b>Invoice date - </b> {getInvoiceProcessingDateString(initialValues as InvoiceInterface)}
													</>
												) : (
													''
												)}

												<br />

												<b>User TZ - </b>
												{initialValues.reservation.tzUser || initialValues.reservation.tzLocation}

												<br />

												<b>Reservation date/time - </b>
												{initialValues.reservation.hoursFrom && (
													<ReservationDuration reservation={initialValues.reservation} />
												)}
											</Typography>
										)}
									</div>

									<br />
									<br />
								</>
							)}

							{initialValues && (
								<TableContainer>
									<Table>
										<TableHead className={classes.itemsTableHead}>
											<TableRow>
												<TableCell className={classes.tableTH}>Date</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Invoice Total
												</TableCell>
												{['Paid'].includes(String(initialValues?.invoiceStatus?.name)) && (
													<TableCell className={classes.tableTH} align="right">
														Paid amount
													</TableCell>
												)}
												{['Refund', 'Partial Refund'].includes(String(initialValues?.invoiceStatus?.name)) && (
													<TableCell className={classes.tableTH} align="right">
														Refunded amount
													</TableCell>
												)}
												{['Refund', 'Partial Refund'].includes(String(initialValues?.invoiceStatus?.name)) && (
													<TableCell className={classes.tableTH} align="right">
														Refund note
													</TableCell>
												)}
												<TableCell className={classes.tableTH} align="right">
													Status
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow className={classes.tableRow}>
												<TableCell component="th" scope="row" className={classes.tableCell}>
													<Typography className={classes.mobileText}>Invoice date:</Typography>
													<Typography>{getInvoiceProcessingDateString(initialValues as InvoiceInterface)}</Typography>
												</TableCell>
												<TableCell align="right" className={classes.tableCell}>
													<Typography className={classes.mobileText}>Paid amount:</Typography>
													<Typography
														dangerouslySetInnerHTML={{
															__html: String(
																initialValues?.stripeInvoice
																	? convertCurrency(initialValues?.stripeInvoice.total / 100)
																	: costProgress || getInvoiceSubTotalString(initialValues as InvoiceInterface)
															),
														}}
													/>
												</TableCell>
												{['Paid'].includes(String(initialValues?.invoiceStatus?.name)) && (
													<TableCell align="right" className={classes.tableCell}>
														<Typography
															dangerouslySetInnerHTML={{
																__html: convertCurrency(
																	parseFloat(
																		((initialValues?.paymentData && initialValues?.paymentData[0]?.amount) ||
																			0) as any
																	)
																) as string,
															}}
														/>
													</TableCell>
												)}
												{['Refund', 'Partial Refund'].includes(String(initialValues?.invoiceStatus?.name)) && (
													<TableCell align="right" className={classes.tableCell}>
														<Typography className={classes.mobileText}>Refund amount:</Typography>
														<Typography
															dangerouslySetInnerHTML={{
																__html: convertCurrency(
																	parseFloat(
																		((initialValues?.refundData &&
																			initialValues?.refundData.length > 0 &&
																			initialValues?.refundData[0].amount / 100) ||
																			0) as any
																	)
																) as string,
															}}
														/>
													</TableCell>
												)}
												{['Refund', 'Partial Refund'].includes(String(initialValues?.invoiceStatus?.name)) && (
													<TableCell align="right" className={classes.tableCell}>
														<Typography className={classes.mobileText}>Refund note:</Typography>
														<Typography>
															{(initialValues?.refundData && initialValues?.refundData[0]?.note) || ''}
														</Typography>
													</TableCell>
												)}
												<TableCell align="right" className={classes.tableCell}>
													<Typography className={classes.mobileText}>Status:</Typography>
													{initialValues?.invoiceStatus && (
														<Typography className={classes.historyDetailsStatusIcon}>
															{initialValues.invoiceStatus.name}
														</Typography>
													)}
													{initialValues?.invoiceStatus?.name === 'Payment failed' && (
														<Typography>
															<br />
															<small style={{ color: 'red' }}>{initialValues.failureMessage}</small>
														</Typography>
													)}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							)}

							<div className={classes.border}>
								<TableContainer>
									<Table>
										<TableHead className={classes.itemsTableHead}>
											<TableRow>
												<TableCell className={classes.tableTH}>Item</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Qty
												</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Price
												</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Tax
												</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Hours Total
												</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Credit Hours
												</TableCell>
												<TableCell className={classes.tableTH} align="right">
													Amount
												</TableCell>
											</TableRow>
										</TableHead>

										{initialValues && (
											<TableBody>
												{(items as unknown as InvoiceItemInterface[]).map((item: InvoiceItemInterface, index: number) => (
													<TableRow key={item.id} className={classes.tableRow}>
														<TableCell component="th" scope="row" className={classes.tableCell}>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.name`}
																control={control}
																defaultValue={item.name}
															/>
															<Typography className={classes.mobileText}>Item:</Typography>
															<Typography>{item.name}</Typography>
														</TableCell>
														<TableCell align="right" className={classes.tableCell}>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.id`}
																control={control}
																defaultValue={item.id}
															/>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.quantity`}
																control={control}
															/>
															<Typography className={classes.mobileText}>Qty:</Typography>
															<Typography>{item.quantity}</Typography>
														</TableCell>
														<TableCell align="right" className={classes.tableCell}>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.price`}
																control={control}
															/>
															<Typography className={classes.mobileText}>Price:</Typography>
															<Typography>{convertCurrency(item.price)}</Typography>
														</TableCell>
														<TableCell align="right" className={classes.tableCell}>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.tax`}
																control={control}
															/>
															<Typography className={classes.mobileText}>Tax:</Typography>
															<Typography>{item.tax ? `${item.tax}%` : '0'}</Typography>
														</TableCell>
														<TableCell align="right" className={classes.tableCell}>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.quantity`}
																control={control}
															/>
															<Typography className={classes.mobileText}>Hours total:</Typography>
															<Typography>
																{item.chargeType === ChargeType.HOURLY &&
																	(SecondsToTimeHelper(item.quantity * 60 * 60, true) as string)}
															</Typography>
														</TableCell>
														<TableCell align="right" className={classes.tableCell}>
															<Controller
																render={({ field }) => <Input {...field} type="hidden" className={classes.hidden} />}
																name={`items.${index}.creditHours`}
																control={control}
															/>
															<Typography className={classes.mobileText}>Credit Hours:</Typography>
															<Typography>
																{item.chargeType === ChargeType.HOURLY &&
																	(SecondsToTimeHelper(item.creditHours * 60 * 60, true) as string)}
															</Typography>
														</TableCell>
														<TableCell align="right" className={classes.tableCell}>
															<Typography className={classes.mobileText}>Amount:</Typography>
															<Typography>{convertCurrency(item.price2)}</Typography>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										)}
									</Table>
								</TableContainer>

								{(isSuperAdmin || isBrandAdmin) && initialValues?.invoiceStatus?.name !== 'Paid' && (
									<Button onClick={() => setEditItemVisible(true)} className={classes.addBtn}>
										<AddIcon /> Add Extras or Discounts
									</Button>
								)}

								<div className={classes.historyDetailsItem}>
									<Typography className={classes.historyDetailsItemText}>Subtotal:</Typography>
									<Typography
										className={classes.historyDetailsItemPrice}
										dangerouslySetInnerHTML={{
											__html: initialValues?.stripeInvoice
												? convertCurrency(initialValues?.stripeInvoice.subtotal / 100)
												: getInvoiceSubTotalString(initialValues as InvoiceInterface),
										}}
									/>
								</div>

								<div className={classes.historyDetailsItem}>
									<Typography className={classes.historyDetailsItemText}>Tax:</Typography>
									<div className={classes.historyDetailsItemPrice}>
										<Typography
											dangerouslySetInnerHTML={{
												__html: convertCurrency(
													initialValues?.stripeInvoice ? initialValues?.stripeInvoice.tax / 100 : initialValues?.tax
												) as string,
											}}
										/>
										<Controller
											render={({ field }) => <Input {...field} type="hidden" disabled />}
											name="tax"
											control={control}
										/>
									</div>
								</div>

								<div className={classes.historyDetailsItem}>
									<Typography className={classes.totalText}>Total:</Typography>
									<Typography className={classes.totalText}>
										<span
											dangerouslySetInnerHTML={{
												__html: convertCurrency(
													initialValues?.stripeInvoice
														? initialValues?.stripeInvoice?.total / 100
														: (initialValues?.subTotal || 0) + (initialValues?.tax || 0)
												) as string,
											}}
										/>
									</Typography>
								</div>
							</div>
						</>
					</Grid>
				</Grid>

				{isSaving && (
					<div className={classes.loaderWrapper}>
						<CircularProgress />
					</div>
				)}
			</form>

			<Dialog onClose={() => setEditItemVisible(false)} open={editItemVisible}>
				<FormInvoiceItemComponent
					initialValues={undefined}
					onSave={(i) => {
						appendItem(i);
						setEditItemVisible(false);
					}}
				/>
			</Dialog>

			<Dialog onClose={() => setChangeDateVisible(false)} open={changeDateVisible}>
				<DialogContent>
					<DatePicker
						disablePast
						views={undefined}
						maxDate={dayjs(initialValues?.processDate).endOf('month')}
						minDate={dayjs(initialValues?.processDate).startOf('month')}
						inputFormat="MM/DD/YYYY"
						value={processDate}
						onChange={handleDateChange}
						renderInput={(props) => <TextField {...props} variant="standard" label="Select new date" />}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default memo(FormInvoiceComponent);
