import React, { useCallback, useContext, useEffect, useState, forwardRef } from 'react';
import { parse as parseQueryString } from 'query-string';
import { useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs, extend } from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import pluralize from 'pluralize';
import classNames from 'classnames';
import Button from '@mui/material/Button';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import { ListItemText } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import convertCurrency from '@helpers/currency-convert.helper';
import { DEFAULT_CURRENCY } from '@core/config';
import InvoiceService, { InvoiceCreateData } from '@service/invoice.service';
import UserService from '@service/user.service';
import SpacePriceComponent from '@shared-components/space-price.component';
import DialogStyles from './style/dialog.style';
import ConfirmCheckoutDialog from './confirm-checkout.dialog';

extend(dayjsDuration);
extend(dayjsutc);
extend(dayjstimezone);

const Transition = forwardRef((props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => (
	<Slide direction="up" ref={ref} {...props} />
));

interface BookingPreviewComponentProps {
	open: boolean;
	onBack: () => any;
	onCheckout: () => any;
	space: SpaceInterface;
	startDate: Dayjs;
	endDate: Dayjs;
}

export default function BookingPreviewComponent({ open, onBack, space, startDate, endDate, onCheckout }: BookingPreviewComponentProps) {
	const classes = DialogStyles();

	dayjs.tz.setDefault(space.venue.tzId);

	const userService = new UserService();
	const invoiceService = new InvoiceService();

	const { search } = useLocation();
	const queryParams = parseQueryString(search);

	const queryIsTeamLead = !!queryParams.isTeamLead;

	const { authBody, updateAuthData, updateCheckinData, userLocation } = useContext(AuthContext);

	const [openConfirm, setOpenConfirm] = useState(false);
	const [res, setRes] = useState({ hours: 0, creditHours: 0, creditBalance: 0, billable: 0 });
	const [subTotal, setSubTotal] = useState(space.price);
	const [salesTaxes, setSalesTaxes] = useState<string[]>([]);
	const [invoiceTax, setInvoiceTax] = useState(0);

	const [isLoading, setIsLoading] = useState(false);
	const { showSnackBar } = useContext(SnackBarContext);

	const spaceCurrency = typeof space.venue.currency === 'undefined' ? DEFAULT_CURRENCY.code : space.venue.currency;

	const spacePrice = space.price;

	const calcItemHours = ({ sDate, eDate, roundHours }: { sDate: Dayjs; eDate: Dayjs; roundHours?: number | undefined }): number => {
		const duration = dayjs.duration(eDate.diff(sDate)).asMinutes();
		const minMinutes: number = roundHours ? roundHours / 60 : 0;
		const billableMinutes: number = minMinutes > duration ? minMinutes : duration;
		return Number((Math.round(billableMinutes) / 60).toFixed(3));
	};

	const handleConfirmClose = () => setOpenConfirm(false);

	const handleConfirmShow = () => setOpenConfirm(true);

	const checkout = async (teamName?: string) => {
		if (!authBody) return;

		try {
			setIsLoading(true);

			const params: Partial<InvoiceCreateData> = {
				spaceId: space.id,
				userId: authBody.id,
				createdById: authBody.id,
				userTz: userLocation?.timezone || space.venue.tzId,
				currency: spaceCurrency,
			};

			if (queryIsTeamLead && space.packageShow === PackageShow.TEAM_MEMBERSHIP && teamName !== '') params.teamName = teamName;

			await invoiceService.save({
				...params,
				createdAt: dayjs.tz(dayjs(), userLocation?.timezone || space.venue.tzId).format(),
				startDate: dayjs(startDate).format(),
				endDate: dayjs(endDate).format(),
			});

			await updateAuthData();
			await updateCheckinData();

			onCheckout();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar({ message: `Error: ${message}`, link: '/payment/methods', linkText: 'Please add a new card here', state: 'error' });
		} finally {
			setIsLoading(false);
			setOpenConfirm(false);
		}
	};

	const setData = useCallback(async () => {
		if (!authBody) return;
		const d = { hours: 0, creditHours: 0, creditBalance: 0, billable: 0 };

		let prePrice = space.price;
		let invoiceTaxTemp = (space.price * space.tax) / 100;

		if (space.chargeType === ChargeType.HOURLY) {
			d.hours = calcItemHours({
				eDate: endDate,
				sDate: startDate,
				roundHours: space.roundHours,
			});
			prePrice = Number((d.hours * space.price).toFixed(3));

			if (
				!space.notAllowCredit &&
				d.hours > 0 &&
				[SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(space.spaceType.logicType!)
			) {
				const credits = await userService.getSpaceCredits(Number(authBody.id!), [Number(space.id!)], d.hours);
				if (credits.length) {
					d.creditBalance = credits[0].creditBalance;
					d.creditHours = credits[0].creditHours;
					d.billable = credits[0].billable;
					prePrice = Number((credits[0].billable * space.price).toFixed(2));
				}
			}
			setRes(d);

			invoiceTaxTemp += (prePrice * space.tax) / 100;
		}

		const spaceTaxMoney = convertCurrency(parseFloat(invoiceTaxTemp as any), DEFAULT_CURRENCY.code, spaceCurrency, true);

		const salesTaxesTemp = [`${spaceTaxMoney} (${space.tax}% Package)`];

		if (space.amenities)
			prePrice += space.amenities
				.map((a: SpaceAmenityInterface) => {
					let amenityPrice = a.price;
					if (a.chargeType === ChargeType.HOURLY) {
						amenityPrice = a.price * d.hours;
					}
					if (a.chargeType === ChargeType.FREE) {
						amenityPrice = 0;
					}
					invoiceTaxTemp += (amenityPrice * Number(a.salesTax)) / 100;

					const amenityTaxMoney = convertCurrency(
						parseFloat(((amenityPrice * Number(a.salesTax)) / 100) as any),
						DEFAULT_CURRENCY.code,
						spaceCurrency,
						true
					);

					if (amenityPrice > 0) salesTaxesTemp.push(`${amenityTaxMoney} (${a.salesTax}% ${a.name || a.amenity!.name})`);
					return amenityPrice;
				})
				.reduce((a: number, b: number) => a + b, 0);

		setInvoiceTax(invoiceTaxTemp);
		setSalesTaxes(salesTaxesTemp);
		setSubTotal(prePrice);
	}, [startDate, endDate]);

	useEffect(() => {
		setData().then();
	}, [startDate, endDate]);

	return (
		<>
			<Dialog fullScreen open={open} onClose={onBack} TransitionComponent={Transition}>
				<div className={classes.backgroundLayer}>
					<Paper onClick={onBack} className={classes.backButton}>
						<ChevronLeftIcon />
					</Paper>
					<div>
						<Typography className={classes.chooseDateTitle}>Package Details</Typography>
					</div>
					<Paper className={classes.chooseDateForm}>
						<div>
							<img
								className={classes.checkoutPhoto}
								src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${
									space.photos.length ? space.photos[0].url : space.venue.photos![0].url
								}`}
								alt=""
							/>
						</div>

						<div>
							<Typography className={classes.checkoutSpaceName}>
								{space.name}
								<br />
								<span className={classes.checkoutSpaceLocation}>{space.venue.name}</span>
								<SpacePriceComponent className={classes.checkoutSpacePrice} space={space} />
							</Typography>
						</div>

						<div className={classes.checkoutDescription}>
							<div className={classes.checkoutDetails}>
								<Typography className={classes.checkoutDetailsTitle}>Details</Typography>
								<List>
									<ListItem className={classes.checkoutDetailItem}>
										<ListItemText inset className={classes.checkoutDetailName} primary={`${space.name}`} />
										<ListItemText
											style={{ paddingLeft: 0, textAlign: 'right' }}
											inset
											primary={
												<b
													dangerouslySetInnerHTML={{
														__html: convertCurrency(
															parseFloat(
																(space.chargeType === ChargeType.HOURLY ? res.hours * spacePrice : spacePrice) as any
															),
															DEFAULT_CURRENCY.code,
															spaceCurrency,
															true
														) as string,
													}}
												/>
											}
										/>
									</ListItem>

									{space.amenities &&
										space.amenities.map((item, index) => (
											<ListItem key={index} className={classes.checkoutDetailItem}>
												<ListItemText
													inset
													className={classes.checkoutDetailName}
													primary={`${item.name === '' ? item.amenity!.name : item.name}`}
												/>
												<ListItemText
													inset
													primary={
														<b
															dangerouslySetInnerHTML={{
																__html:
																	item.chargeType === ChargeType.FREE
																		? 'Free'
																		: (convertCurrency(
																				parseFloat(
																					(item.chargeType === ChargeType.HOURLY
																						? res.hours * item.price
																						: item.price) as any
																				),
																				DEFAULT_CURRENCY.code,
																				spaceCurrency,
																				true
																		  ) as string),
															}}
														/>
													}
												/>
											</ListItem>
										))}
								</List>
							</div>

							<div className={classes.checkoutPrice}>
								<List>
									<ListItem className={classes.checkoutPriceItem}>
										<ListItemText className={classes.checkoutPriceName} inset primary="Charge Type: " />
										<ListItemText className={classes.checkoutPriceValue} inset primary={`${space.chargeType}`} />
									</ListItem>

									<ListItem className={classes.checkoutPriceItem}>
										<ListItemText className={classes.checkoutPriceName} inset primary="Subtotal: " />
										<ListItemText
											className={classes.checkoutPriceValue}
											inset
											primary={
												<span
													dangerouslySetInnerHTML={{
														__html: convertCurrency(
															parseFloat(subTotal as any),
															DEFAULT_CURRENCY.code,
															spaceCurrency,
															true
														) as string,
													}}
												/>
											}
										/>
									</ListItem>

									<ListItem className={classes.checkoutPriceItem} style={{ display: 'block' }}>
										<ListItemText className={classes.checkoutPriceName} inset primary="Sales Tax: " />
										<ListItemText
											className={classes.checkoutPriceValue}
											style={{ width: '100%', textAlign: 'left' }}
											inset
											primary={salesTaxes.map((taxText, key) => (
												<Typography
													key={key}
													dangerouslySetInnerHTML={{
														__html: taxText,
													}}
												/>
											))}
										/>
									</ListItem>

									{space.chargeType === ChargeType.HOURLY && !space.notAllowCredit && (
										<>
											<ListItem className={classNames(classes.checkoutPriceItem, classes.checkoutPriceAmount)}>
												<ListItemText className={classes.checkoutPriceName} inset primary="Hours Booked: " />
												<ListItemText
													className={classes.checkoutPriceValue}
													inset
													primary={`${res.hours} ${pluralize('hr', res.hours, false)}`}
												/>
											</ListItem>
											<ListItem className={classes.checkoutPriceItem}>
												<ListItemText className={classes.checkoutPriceName} inset primary="Credits will be Used: " />
												<ListItemText
													className={classes.checkoutPriceValue}
													inset
													primary={`${res.creditHours} ${pluralize('hr', res.creditHours, false)}`}
												/>
											</ListItem>
											<ListItem className={classes.checkoutPriceItem}>
												<ListItemText className={classes.checkoutPriceName} inset primary="Credits Balance (Total): " />
												<ListItemText
													className={classes.checkoutPriceValue}
													inset
													primary={`${res.creditBalance} ${pluralize('hr', res.creditBalance, false)}`}
												/>
											</ListItem>
											<ListItem className={classes.checkoutPriceItem}>
												<ListItemText className={classes.checkoutPriceName} inset primary="Charged For: " />
												<ListItemText
													className={classes.checkoutPriceValue}
													inset
													primary={`${res.billable} ${pluralize('hr', res.billable, false)}`}
												/>
											</ListItem>
										</>
									)}

									<ListItem className={classNames(classes.checkoutPriceItem, classes.checkoutPriceAmount)}>
										<ListItemText className={classes.checkoutPriceName} inset primary="Amount Due: " />
										<ListItemText
											className={classNames(classes.checkoutPriceValue, classes.checkoutPriceSum)}
											inset
											primary={
												<b
													dangerouslySetInnerHTML={{
														__html: convertCurrency(
															parseFloat((invoiceTax + subTotal) as any),
															DEFAULT_CURRENCY.code,
															spaceCurrency,
															true
														) as string,
													}}
												/>
											}
										/>
									</ListItem>
								</List>

								<Button
									disabled={isLoading}
									variant="contained"
									color="primary"
									className={classes.buttonSubmit}
									onClick={handleConfirmShow}
								>
									Checkout & Pay
								</Button>
							</div>
						</div>
					</Paper>
				</div>
			</Dialog>

			<ConfirmCheckoutDialog open={openConfirm} space={space} onCancel={handleConfirmClose} onOk={checkout} isLoading={isLoading} />
		</>
	);
}
