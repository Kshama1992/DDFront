import React, { useContext, useState } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import RoomIcon from '@mui/icons-material/Room';
import IconButton from '@mui/material/IconButton';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListItemText from '@mui/material/ListItemText';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HomeIcon from '@mui/icons-material/Home';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import ReservationStatus from 'dd-common-blocks/dist/type/ReservationStatus';
import DescriptionIcon from '@mui/icons-material/Description';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import InvoiceItemInterface, { InvoiceItemType } from 'dd-common-blocks/dist/interface/invoice-item.interface';
import { AuthContext } from '@context/auth.context';
import { DEFAULT_CURRENCY } from '@core/config';
import AvatarComponent from '@shared-components/avatar.component';
import { getCurrencySymbol, getInvoiceBookedAtString, getInvoiceNumber, getInvoiceSubTotalString, getInvoiceTaxString } from 'dd-common-blocks';
import checkPermsHelper from '@helpers/checkPerms.helper';
import ReservationService from '@service/reservation.service';
import ConfirmDialog from '@shared-components/confirm.dialog';
import FormReservationComponent from '@forms/form-reservation.component';
import { SnackBarContext } from '@context/snack-bar.context';
import InvoiceService from '@service/invoice.service';
import formatPhone from '@helpers/format-phone.helper';
import { capitalize } from '@mui/material/utils';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import ReservedForBlockComponent from './reserved-for-block.component';
import CreditsAndDurationBlock from './credits-n-duration-block.component';
import SpaceLinkComponent from './space-link.component';
import CreditsLineComponent from './credits-line.component';
import activityRowStyles from './activity-row.styles';
import TimeStringComponent from './time-string.component';
import BookedByBlock from './booked-by.component';
import ReservedForListItemComponent from './reserved-for-list-item.component';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

export default function ActivityRowComponent({ invoice, showCreditHours = false }: { invoice: InvoiceInterface; showCreditHours?: boolean }) {
	const classes = activityRowStyles({});
	const reservationService = new ReservationService();
	const invoiceService = new InvoiceService();
	const [data, setData] = useState<InvoiceInterface>(invoice);
	const [open, setOpen] = useState(false);
	const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
	const [isCanceling, setIsCanceling] = useState(false);

	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [checkOutOpen, setCheckOutOpen] = useState(false);

	const [editOpen, setEditOpen] = useState(false);
	const { isSuperAdmin, authBody } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	const invoiceSpaceLine = data.items?.find((i: Partial<InvoiceItemInterface>) => i.invoiceItemType === InvoiceItemType.SPACE);

	let spaceCurrency = typeof data.currency === 'undefined' ? DEFAULT_CURRENCY.code : data.currency;

	if (data.stripeInvoice) spaceCurrency = invoice.stripeInvoice.currency.toUpperCase();

	const canEditUser = (brandId: number) => {
		if (isSuperAdmin) return true;
		if (!checkPermsHelper(['Customer Community'], ['Community Members'], authBody)) return false;
		return authBody?.brandId === brandId;
	};

	const canEditSpace = (venueBrandId: number) => {
		if (isSuperAdmin) return true;
		if (!checkPermsHelper(['Customer Spaces'], ['Spaces'], authBody)) return false;
		return authBody?.brandId === venueBrandId;
	};

	const showAdditional = () => setOpen(!open);

	const cancelActivity = async () => {
		try {
			setIsCanceling(true);
			const newReservation = await reservationService.save({ status: ReservationStatus.CANCELED }, data.reservationId);
			setCancelConfirmOpen(false);
			showSnackBar('Reservation canceled!');
			if (newReservation) setData({ ...newReservation.invoice, reservation: newReservation });
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsCanceling(false);
		}
	};

	const handleCloseCheckOut = () => setCheckOutOpen(false);

	const checkoutUser = async () => {
		try {
			setIsCheckingOut(true);
			const checkoutInvoice = await invoiceService.checkOut(data.reservationId);
			if (checkoutInvoice) setData(checkoutInvoice);
			showSnackBar('Checkout done!');
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsCheckingOut(false);
			handleCloseCheckOut();
		}
	};

	const isEditable = () => {
		if (data.space && data.space.spaceType.logicType === SpaceTypeLogicType.MONTHLY) return false;
		if (data.reservation?.status !== ReservationStatus.ACTIVE) return false;
		if (!data.reservation?.hoursTo) return true;
		return !!(data.reservation?.hoursTo && dayjs(data.reservation.hoursTo).isAfter(dayjs()));
	};

	const handleEditSave = (res: InvoiceInterface) => {
		setData(res);
		setEditOpen(false);
	};

	const handleCancelEdit = () => setEditOpen(false);

	const handleCloseConfirm = () => setCancelConfirmOpen(false);

	const handleOpenCheckout = () => setCheckOutOpen(true);

	const handleOpenEdit = () => setEditOpen(true);

	const handleOpenConfirm = () => setCancelConfirmOpen(true);

	return (
		<>
			<TableRow key={data.id} className={classes.tableRow}>
				<TableCell component="th" scope="row" align="left" className={classes.tableCell}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={3} xl={2}>
							<AvatarComponent
								className={classes.avatar}
								src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}/64x64_cover${
									data.space!.photos.length ? data.space!.photos[0].url : data.venue!.photos![0].url
								}`}
								altText={data.space!.name}
							/>
						</Grid>
						<Grid item xs={12} md={9} xl={10} className={classes.spaceNameWrap}>
							<SpaceLinkComponent space={data.space} subscription={data.subscription} canEdit={canEditSpace(data.venue!.brandId)} />
							{data.reservation && (
								<>
									<ReservedForBlockComponent
										reservation={data.reservation!}
										canEdit={canEditUser(data.reservation.reservedTo!.brandId)}
									/>
									<BookedByBlock
										reservation={data.reservation!}
										createdBy={data.createdBy!}
										canEdit={canEditUser(data.reservation.createdBy!.brandId)}
									/>
								</>
							)}
						</Grid>
					</Grid>
				</TableCell>

				<TableCell className={classes.tableCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<RoomIcon className={classes.locationIcon} />
						{data.venue ? data.venue.name : ''}
					</Typography>
				</TableCell>

				<TableCell className={classes.tableCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<TimeStringComponent reservation={data.reservation!} space={data.space} />
					</Typography>
				</TableCell>

				<TableCell className={classes.priceCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<b className={classes.mobileText}>Price: </b>
						<span
							dangerouslySetInnerHTML={{
								__html: `${getCurrencySymbol(spaceCurrency)}${data.subTotal + data.tax}`,
							}}
						/>
					</Typography>
				</TableCell>

				{showCreditHours && data.space && (
					<TableCell className={classes.priceCell}>
						<CreditsLineComponent spaceType={data.space.spaceType} invoiceSpaceLine={invoiceSpaceLine} reservation={data.reservation} />
					</TableCell>
				)}

				<TableCell className={classes.priceCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<b className={classes.mobileText}>Status: : </b>
						{data.invoiceStatus?.name}
					</Typography>
				</TableCell>

				<TableCell className={classes.priceCell}>
					{data.reservation && (
						<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
							<b className={classes.mobileText}>Reservation status: : </b>
							{capitalize(data.reservation.status)}
						</Typography>
					)}
				</TableCell>

				<TableCell className={classes.actionCell} style={{ minWidth: 120, paddingLeft: 0, textAlign: 'right' }}>
					{isEditable() && isSuperAdmin && !data.reservation.hoursTo && (
						<IconButton title="Checkout" size="small" onClick={handleOpenCheckout} color="secondary">
							<TimerOffIcon style={{ fontSize: 19 }} />
						</IconButton>
					)}
					{isEditable() && isSuperAdmin && (
						<IconButton title="Cancel reservation" size="small" onClick={handleOpenConfirm} color="secondary">
							<BlockIcon style={{ fontSize: 19 }} />
						</IconButton>
					)}
					{isEditable() && data.space!.spaceType.logicType !== SpaceTypeLogicType.EVENT && isSuperAdmin && (
						<IconButton title="Edit reservation" size="small" onClick={handleOpenEdit} color="primary">
							<EditIcon style={{ fontSize: 19 }} />
						</IconButton>
					)}
					<IconButton title="Show more" size="small" onClick={showAdditional} color="primary">
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
			</TableRow>

			<TableRow className={classes.tableRow}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7} className={classes.tableCell}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Table>
							<TableBody>
								<TableRow className={classes.tableCell}>
									<TableCell className={classes.tableCell}>
										<List>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<CalendarTodayIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText primary="Booked At:" secondary={getInvoiceBookedAtString(data)} />
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<CreditCardIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Charge Type:"
													secondary={
														data.reservation && data.reservation.chargeType ? data.reservation.chargeType : 'No data'
													}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<HomeIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Space Type:"
													secondary={data.space!.spaceType ? data.space!.spaceType.name : 'No data'}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<QueryBuilderIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Space TZ:"
													secondary={data.reservation?.tzLocation ? data.reservation.tzLocation : 'No data'}
												/>
											</ListItem>
										</List>
									</TableCell>

									<TableCell className={classes.tableCell}>
										<List>
											{data && data.reservation && (
												<ReservedForListItemComponent
													reservation={data.reservation}
													canEdit={canEditUser(data.reservation.reservedTo!.brandId)}
												/>
											)}

											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<MailOutlineIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Email:"
													secondary={
														data.reservation?.reservedTo ? (
															<a href={`mailto:${data.reservation.reservedTo.email}`}>
																{data.reservation.reservedTo.email}
															</a>
														) : (
															'No data'
														)
													}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<PhoneIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Phone:"
													secondary={
														<span
															dangerouslySetInnerHTML={{
																__html: String(
																	data.reservation?.reservedTo
																		? formatPhone(String(data.reservation.reservedTo.phone), true)
																		: 'No data'
																),
															}}
														/>
													}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<QueryBuilderIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="User TZ:"
													secondary={data.reservation?.tzUser ? data.reservation.tzUser : 'No data'}
												/>
											</ListItem>
										</List>
									</TableCell>

									{data.reservation && (
										<CreditsAndDurationBlock
											spaceType={data.space!.spaceType}
											invoiceSpaceLine={invoiceSpaceLine}
											reservation={data.reservation}
										/>
									)}

									<TableCell colSpan={2} className={classes.tableCell}>
										<List>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<DescriptionIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText primary="Invoice #:" secondary={getInvoiceNumber(data)} />
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<DescriptionIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Invoice Subtotal:"
													secondary={<span dangerouslySetInnerHTML={{ __html: getInvoiceSubTotalString(data) }} />}
												/>
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<DescriptionIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Invoice Tax:"
													secondary={<span dangerouslySetInnerHTML={{ __html: getInvoiceTaxString(data) }} />}
												/>
											</ListItem>
										</List>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Collapse>
				</TableCell>
			</TableRow>

			<ConfirmDialog
				isLoading={isCanceling}
				open={cancelConfirmOpen}
				onClose={handleCloseConfirm}
				text={`Are you sure you want to cancel ${data.space!.name} reservation?`}
				action={cancelActivity}
				actionText="Yes"
				cancelText="No"
			/>

			<ConfirmDialog
				isLoading={isCheckingOut}
				open={checkOutOpen}
				onClose={handleCloseCheckOut}
				text={`Are you sure you want to checkout ${data.reservation?.reservedTo!.firstname} ${data.reservation?.reservedTo!.lastname} from ${
					data.space!.name
				}?`}
				action={checkoutUser}
				actionText="Yes"
				cancelText="No"
			/>

			<Dialog onClose={() => setEditOpen(false)} open={editOpen}>
				<FormReservationComponent
					onCancel={handleCancelEdit}
					reservation={{ ...data.reservation, space: data.space }}
					onSave={handleEditSave}
				/>
			</Dialog>
		</>
	);
}
