import React, { useEffect, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import InvoiceItemInterface from 'dd-common-blocks/dist/interface/invoice-item.interface';
import { siteTitleHelper } from '@helpers/site-title.helper';
import { siteDescriptionHelper } from '@helpers/site-description.helper';
import AddressString from '@shared-components/address-string.component';
import InvoiceService from '@service/invoice.service';
import BasePage from '../base.page';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: 'calc(100% - 70px)',
			margin: 0,
			background: '#efefef',
			position: 'relative',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
				// padding: '17px 14px 17px 58px'
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		root: {
			width: 'calc(100% - 90px)',
			height: 'calc(100% - 70px)',
			margin: 0,
			marginLeft: 90,
			background: '#efefef',
			position: 'relative',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		top: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
		inner: {
			position: 'relative',
			minHeight: 400,
			// padding: '30px 60px 40px',
		},
		historyDetailsWrapper: {
			maxWidth: 600,
			width: '100%',
			margin: '0 auto',
			padding: 15,
			boxSizing: 'border-box',
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				boxShadow: 'none',
			},
		},
		historyDetailsImage: {
			width: '100%',
		},
		historyDetailsStatus: {
			display: 'flex',
			justifyContent: 'space-between',
			borderTop: '1px solid #f1f1f1',
			padding: '20px 0 20px',
		},
		historyDetailsName: {
			fontWeight: 600,
			fontSize: 24,
			marginTop: 20,
			marginBottom: 0,
		},
		historyDetailsAddress: {
			opacity: 0.7,
		},
		historyDetailsBooked: {
			opacity: 0.6,
			display: 'flex',
			justifyContent: 'space-between',
		},
		historyDetailsBookedText: {
			fontSize: 16,
		},
		historyDetailsTitle: {
			textTransform: 'uppercase',
			fontWeight: 600,
		},
		historyDetailsText: {
			fontSize: 24,
		},
		historyDetailsStatusIcon: {
			color: '#3a6ce3',
		},
		historyDetailsStatusIconNotPayed: {
			color: 'red',
		},
		historyDerailsLabel: {
			background: '#efefef',
			textAlign: 'center',
			fontWeight: 600,
			padding: 10,
		},
		historyLabelText: {
			marginBottom: 0,
			color: '#929292',
			fontWeight: 600,
		},
		historyDerailsItem: {
			display: 'flex',
			justifyContent: 'space-between',
			borderBottom: '1px solid  #ececec',
			padding: 10,
		},
		historyDetailsItemText: {
			marginBottom: 0,
			fontSize: 20,
		},
		historyDetailsItemPrice: {
			marginBottom: 0,
			fontSize: 20,
			fontWeight: 600,
		},
		historyDerailsButton: {
			color: '#fff',
			background: '#3a6ce3',
			display: 'block',
			margin: '0 auto',
			marginTop: 30,
			marginBottom: 20,
			width: 135,
			outline: 'none',
		},
		row: {
			display: 'flex',
			flexDirection: 'row',
			marginTop: 10,
		},
		rowCentered: {
			alignItems: 'center',
			justifyContent: 'center',
		},

		disputeContainer: {
			[theme.breakpoints.down('md')]: {
				height: 'calc(100%)',
			},
		},
		itemsGap: {
			display: 'none',
			[theme.breakpoints.down('md')]: {
				display: 'block',
				height: '10vh',
			},
		},
		backButton: {
			height: 40,
			width: 40,
			margin: 20,
			textAlign: 'center',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			borderRadius: '50%',
			zIndex: 100,
			top: '0%',
			left: '0%',
			cursor: 'pointer',
			color: '#000',
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
	})
);

export default function HistorySinglePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const invoiceService = new InvoiceService();
	const { id } = useParams();
	const navigate = useNavigate();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [timeFormat, setTimeFormat] = useState<string>('hh:mm A');
	const [invoice, setInvoice] = useState<InvoiceInterface>();
	const [loading, setLoading] = useState(true);

	const loadInvoice = useCallback(async () => {
		const i = await invoiceService.single(id);
		if (i.venue?.tzId) {
			const isUSA = i.venue?.tzId.indexOf('America') !== -1;
			setTimeFormat(isUSA ? 'hh:mm A' : 'HH:mm');
		}
		setInvoice(i);
		setLoading(false);
	}, [id]);

	useEffect(() => {
		loadInvoice().then();
	}, [id]);

	const costProgress = invoice && invoice.invoiceStatus!.name === 'Upcoming-Hours' ? 'In Progress' : null;
	const cost =
		invoice && invoice.subTotal
			? `$${(invoice.tax ? (invoice.subTotal * invoice.tax) / 100 : 0) + invoice.subTotal}`
			: invoice && (invoice.paidAmount ? invoice.paidAmount : 0);

	const getInvoiceItemPrice = (item: Partial<InvoiceItemInterface>) => {
		if (item.name !== 'DropDesk Hours') return `$ ${item.price}`;
		if (item.name === 'DropDesk Hours') return `hrs. ${item.price}`;
	};

	const getHoursToString = (inputIvoice: InvoiceInterface) => {
		if (!inputIvoice.reservation || !inputIvoice.reservation.hoursTo) return '';
		return `${dayjs(inputIvoice.reservation!.hoursFrom).format(`D MMMM YYYY ${timeFormat}`)} to ${dayjs(inputIvoice.reservation!.hoursTo).format(
			`D MMMM YYYY ${timeFormat}`
		)}`;
	};

	return (
		<BasePage>
			<Helmet>
				<title>{siteTitleHelper('Invoice details')}</title>
				<meta name="description" content={siteDescriptionHelper()} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item md={12} xl={12} xs={12}>
					<Paper className={classes.historyDetailsWrapper}>
						{loading && <CircularProgress />}

						{!loading && invoice && (
							<>
								<Paper onClick={() => navigate(-1)} className={classes.backButton}>
									<ChevronLeftIcon />
								</Paper>

								<img
									className={classes.historyDetailsImage}
									src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${
										invoice.space!.photos.length ? invoice.space!.photos[0].url : invoice.venue!.photos![0].url
									}`}
									alt="Invoice Photo"
								/>

								<Typography className={classes.historyDetailsName}>{invoice.space!.name}</Typography>
								<AddressString
									className={classes.historyDetailsAddress}
									addressString={`${invoice.venue!.address}, ${invoice.venue!.address2}`}
								/>

								<div className={classes.historyDetailsBooked}>
									<Typography className={classes.historyDetailsBookedText}>
										{invoice.space!.spaceType ? invoice.space!.spaceType.name : ''}{' '}
									</Typography>
									<Typography className={classes.historyDetailsBookedText}>
										{invoice.reservation!.bookedAt
											? dayjs(invoice.reservation!.bookedAt).format(`D MMMM YYYY ${timeFormat}`)
											: ''}
										<br />
										{getHoursToString(invoice)}
										{!invoice.reservation!.hoursTo && 'Is ongoing'}
									</Typography>
								</div>

								<br />
								<br />

								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Date</TableCell>
												<TableCell align="right">Total</TableCell>
												<TableCell align="right">Status</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell component="th" scope="row">
													{dayjs(invoice ? invoice.createdAt : '').format('D MMMM YYYY')}
												</TableCell>
												<TableCell align="right">{costProgress || cost}</TableCell>
												<TableCell align="right">
													{invoice && invoice.invoiceStatus && (
														<span className={classes.historyDetailsStatusIcon}>{invoice.invoiceStatus.name}</span>
													)}
													{invoice && invoice.invoiceStatus!.name === 'Payment failed' && (
														<span>
															<br />
															<small style={{ color: 'red' }}>{invoice.failureMessage}</small>
														</span>
													)}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>

								<br />
								<br />

								<div className={classes.historyDerailsLabel}>
									<Typography className={classes.historyLabelText}>DETAILS</Typography>
								</div>

								<TableContainer>
									<Table>
										<TableBody>
											{invoice.items &&
												invoice.items.length > 0 &&
												invoice.items.map((item) => (
													<TableRow key={item.id}>
														<TableCell component="th" scope="row">
															{item.name}
														</TableCell>
														<TableCell align="right">
															<b>{getInvoiceItemPrice(item)}</b>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>

								{invoice.tax > 0 && (
									<div className={classes.historyDerailsItem}>
										<Typography className={classes.historyDetailsItemText}>Sales Tax</Typography>
										<Typography className={classes.historyDetailsItemPrice}>{invoice.tax}</Typography>
									</div>
								)}
							</>
						)}
					</Paper>
				</Grid>
			</Grid>
		</BasePage>
	);
}
