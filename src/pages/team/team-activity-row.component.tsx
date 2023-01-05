import React, { useContext, useState } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Grid';
import RoomIcon from '@mui/icons-material/Room';
import IconButton from '@mui/material/IconButton';
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
import DescriptionIcon from '@mui/icons-material/Description';
import InvoiceItemInterface, { InvoiceItemType } from 'dd-common-blocks/dist/interface/invoice-item.interface';
import InvoiceInterface from 'dd-common-blocks/lib/interface/invoice.interface';
import { AuthContext } from '@context/auth.context';
import { DEFAULT_CURRENCY } from '@core/config';
import { getCurrencySymbol, getInvoiceBookedAtString, getInvoiceNumber, getInvoiceSubTotalString, getInvoiceTaxString } from 'dd-common-blocks';
import formatPhone from '@helpers/format-phone.helper';
import checkPermsHelper from '@helpers/checkPerms.helper';
import AvatarComponent from '@shared-components/avatar.component';
import ReservedForBlockComponent from '../activity/reserved-for-block.component';
import ReservedForListItemComponent from '../activity/reserved-for-list-item.component';
import CreditsAndDurationBlock from '../activity/credits-n-duration-block.component';
import SpaceLinkComponent from '../activity/space-link.component';
import CreditsLineComponent from '../activity/credits-line.component';
import TimeStringComponent from '../activity/time-string.component';
import BookedByBlock from '../activity/booked-by.component';
import activityRowStyles from '../activity/activity-row.styles';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

export default function ActivityRowComponent({ invoice }: { invoice: InvoiceInterface }) {
	const classes = activityRowStyles({});
	const [open, setOpen] = useState(false);
	const { isSuperAdmin, authBody } = useContext(AuthContext);

	const { reservation, reservationId } = invoice;
	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	const invoiceSpaceLine = invoice.items!.find((i: Partial<InvoiceItemInterface>) => i.invoiceItemType === InvoiceItemType.SPACE);

	const spaceCurrency = typeof invoice.currency === 'undefined' ? DEFAULT_CURRENCY.code : invoice.currency;

	const canEditUser = (brandId: number | undefined) => {
		if (!brandId) return false;
		if (isSuperAdmin) return true;
		if (!checkPermsHelper(['Customer Community'], ['Community Members'], authBody)) return false;
		return authBody?.brandId === brandId;
	};

	const canEditSpace = (venueBrandId: number | undefined) => {
		if (!venueBrandId) return false;
		if (isSuperAdmin) return true;
		if (!checkPermsHelper(['Customer Spaces'], ['Spaces'], authBody)) return false;
		return authBody?.brandId === venueBrandId;
	};

	const showAdditional = () => setOpen(!open);

	return (
		<>
			<TableRow key={reservationId} className={classes.tableRow}>
				<TableCell component="th" scope="row" align="left" className={classes.tableCell}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={3} xl={2}>
							<AvatarComponent
								className={classes.avatar}
								src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}/64x64_cover${
									invoice.space?.photos.length ? invoice.space.photos[0].url : invoice.venue!.photos![0].url
								}`}
								altText={invoice.space?.name || ''}
							/>
						</Grid>
						<Grid item xs={12} md={9} xl={10} className={classes.spaceNameWrap}>
							<SpaceLinkComponent
								space={invoice.space}
								subscription={invoice.subscription}
								canEdit={canEditSpace(invoice.venue?.brandId)}
							/>
							{reservation && reservation.reservedTo && (
								<Typography component="p" className={classes.textSecondary}>
									<ReservedForBlockComponent reservation={reservation} canEdit={canEditUser(reservation.reservedTo.brandId)} />
									<BookedByBlock
										reservation={reservation}
										createdBy={invoice.createdBy!}
										canEdit={canEditUser(invoice.createdBy!.brandId)}
									/>
								</Typography>
							)}
						</Grid>
					</Grid>
				</TableCell>

				<TableCell className={classes.tableCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<RoomIcon className={classes.locationIcon} />
						{invoice.venue ? invoice.venue.name : ''}
					</Typography>
				</TableCell>

				<TableCell className={classes.tableCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<TimeStringComponent reservation={reservation} space={invoice.space} />
					</Typography>
				</TableCell>

				<TableCell className={classes.priceCell}>
					{reservation && (
						<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
							<b className={classes.mobileText}>Price: </b>
							<span
								dangerouslySetInnerHTML={{
									__html: `${getCurrencySymbol(spaceCurrency)}${(invoice.subTotal + invoice.tax).toFixed(2)}`,
								}}
							/>
						</Typography>
					)}
				</TableCell>

				{reservation && invoice.space && (
					<TableCell className={classes.priceCell}>
						<CreditsLineComponent spaceType={invoice.space.spaceType} invoiceSpaceLine={invoiceSpaceLine} reservation={reservation} />
					</TableCell>
				)}

				<TableCell className={classes.priceCell}>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						<b className={classes.mobileText}>Status: : </b>
						{invoice.invoiceStatus?.name}
					</Typography>
				</TableCell>

				<TableCell className={classes.actionCell}>
					<IconButton aria-label="expand row" size="small" onClick={showAdditional} color="primary">
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
												<ListItemText primary="Booked At:" secondary={getInvoiceBookedAtString(invoice)} />
											</ListItem>
											{reservation && (
												<ListItem>
													<ListItemAvatar>
														<Avatar>
															<CreditCardIcon />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary="Charge Type:" secondary={reservation.chargeType || 'No data'} />
												</ListItem>
											)}
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<HomeIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Space Type:"
													secondary={invoice.space?.spaceType ? invoice.space.spaceType.name : 'No data'}
												/>
											</ListItem>
											{reservation && (
												<ListItem>
													<ListItemAvatar>
														<Avatar>
															<QueryBuilderIcon />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary="Space TZ:" secondary={reservation.tzLocation || 'No data'} />
												</ListItem>
											)}
										</List>
									</TableCell>

									<TableCell className={classes.tableCell}>
										<List>
											{reservation && (
												<ReservedForListItemComponent
													reservation={reservation}
													canEdit={canEditUser(reservation.reservedTo?.brandId)}
												/>
											)}
											{reservation && (
												<ListItem>
													<ListItemAvatar>
														<Avatar>
															<MailOutlineIcon />
														</Avatar>
													</ListItemAvatar>
													<ListItemText
														primary="Email:"
														secondary={
															reservation.reservedTo ? (
																<a href={`mailto:${reservation.reservedTo.email}`}>{reservation.reservedTo.email}</a>
															) : (
																'No data'
															)
														}
													/>
												</ListItem>
											)}
											{reservation && (
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
																		reservation.reservedTo
																			? formatPhone(String(reservation.reservedTo.phone), true)
																			: 'No data'
																	),
																}}
															/>
														}
													/>
												</ListItem>
											)}
											{reservation && (
												<ListItem>
													<ListItemAvatar>
														<Avatar>
															<QueryBuilderIcon />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary="User TZ:" secondary={reservation.tzUser || 'No data'} />
												</ListItem>
											)}
										</List>
									</TableCell>

									{reservation && invoice.space && (
										<CreditsAndDurationBlock
											spaceType={invoice.space.spaceType}
											invoiceSpaceLine={invoiceSpaceLine}
											reservation={reservation}
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
												<ListItemText primary="Invoice #:" secondary={getInvoiceNumber(invoice)} />
											</ListItem>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<DescriptionIcon />
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary="Invoice Subtotal:"
													secondary={<span dangerouslySetInnerHTML={{ __html: getInvoiceSubTotalString(invoice) }} />}
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
													secondary={<span dangerouslySetInnerHTML={{ __html: getInvoiceTaxString(invoice) }} />}
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
		</>
	);
}
