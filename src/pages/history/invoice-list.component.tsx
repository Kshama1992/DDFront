import React, { useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
// import Button from '@mui/material/Button';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import InvoiceStatusInterface from 'dd-common-blocks/dist/interface/invoice-status.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
// import AvatarComponent from '@shared-components/avatar.component';
import IconButton from '@mui/material/IconButton';
import InvoiceService from '@service/invoice.service';
import SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';
import { Theme } from '@mui/material/styles';
import {
	dateWithTz,
	getInvoiceCredits,
	getInvoiceFullPriceString,
	getInvoiceNumber,
	getInvoicePayDateString,
	getInvoiceProcessingDateString,
} from 'dd-common-blocks';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import socket from '@core/socket';
import SocketEventsType from 'dd-common-blocks/dist/type/SocketEventsType';
import TableComponent, { NestedValueGetter } from '@shared-components/table.component';
import InvoiceViewComponent from './invoice-view.component';
import InvoiceListStyle from './style/invoice-list.style';

export default function InvoiceListComponent({ type = 'all', user }: { type: 'all' | 'past' | 'upcoming'; user: UserInterface }) {
	const classes = InvoiceListStyle({});

	const invoiceService = new InvoiceService();

	const theme = useTheme();
	const isMobile = useMediaQuery((theme1: Theme) => theme1.breakpoints.down('md'));
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewInvoice, setPreviewInvoice] = useState<number | undefined>();
	const [statusList, setStatusList] = useState<InvoiceStatusInterface[]>([]);
	const [upcomingStatusIds, setUpcomingStatusIds] = useState<number[]>([]);
	const [pastStatusIds, setPastStatusIds] = useState<number[]>([]);

	const loadStatusList = useCallback(async () => {
		const [statusListI] = await invoiceService.statusList();
		setStatusList(statusListI);

		setPastStatusIds(
			statusListI
				.filter((i: InvoiceStatusInterface) => !['Upcoming', 'Upcoming-Hours'].includes(i.name))
				.map((i: InvoiceStatusInterface) => Number(i.id))
		);

		setUpcomingStatusIds(
			statusListI.filter((i: InvoiceStatusInterface) => ['Upcoming'].includes(i.name)).map((i: InvoiceStatusInterface) => Number(i.id))
		);
	}, []);

	useEffect(() => {
		loadStatusList().then();
	}, []);

	socket
		.off(SocketEventsType.USER_INVOICE_UPDATED, () => {})
		.on(SocketEventsType.USER_INVOICE_UPDATED, () => {
			setStatusList([]);
			loadStatusList().then();
		});

	const getStatusColor = (statusName: string) => {
		if (statusName === 'Paid') return theme.palette.success.main;
		if (statusName === 'Payment Failed') return theme.palette.error.main;
		return theme.palette.text.primary;
	};

	const handlePreviewClose = () => {
		setPreviewVisible(false);
	};

	const handleShowPreview = (invoiceId: number) => {
		setPreviewInvoice(invoiceId);
		setPreviewVisible(true);
	};

	const getTimeFormat = (reservation: ReservationInterface | null) => {
		if (!reservation) return 'hh:mm A';
		const tzUser = reservation.tzLocation;
		const isUSA = tzUser && tzUser.indexOf('America') !== -1;
		return isUSA ? 'hh:mm A' : 'HH:mm';
	};

	const getReservationTz = (invoice: InvoiceInterface) => invoice.reservation?.tzLocation || invoice.venue.tzId;

	const columns: GridColDef[] = [
		// {
		// 	field: 'spacePhoto',
		// 	headerName: '',
		// 	sortable: false,
		// 	width: 30,
		// 	valueGetter: ({ row: invoice }: GridRenderCellParams) => (
		// 		<>
		// 			{invoice.space && (
		// 				<AvatarComponent
		// 					className={classes.avatar}
		// 					src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${
		// 						invoice.space.photos.length ? invoice.space.photos[0].url : invoice.venue!.photos![0].url
		// 					}`}
		// 					altText={invoice.space.name}
		// 				/>
		// 			)}
		// 		</>
		// 	),
		// },
		{
			field: 'spaceName',
			headerName: 'Package',
			sortable: false,
			width: type === 'upcoming' ? 300 : 120,
			cellClassName: classes.wrapText,
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<>
					{!invoice.space && 'no space'}
					{invoice.space && invoice.space.name}
					{invoice.space && invoice.space.status === SpaceStatus.DELETED && <b> (Package deleted)</b>}
					{invoice.space.spaceType.logicType === SpaceTypeLogicType.MONTHLY &&
						invoice.subscription &&
						invoice.subscription.status === SubscriptionStatus.DELETED && <b> (Subscription deleted)</b>}
					{invoice.space.spaceType.logicType === SpaceTypeLogicType.MONTHLY &&
						invoice.subscription &&
						invoice.subscription.status === SubscriptionStatus.CANCELED && <b> (Subscription canceled)</b>}
				</>
			),
		},
		{
			field: 'venue.name',
			headerName: 'Venue name',
			headerClassName: classes.wrapText,
			width: 100,
			sortable: false,
			valueGetter: NestedValueGetter,
			cellClassName: classes.wrapText,
		},
		{
			field: 'processDate',
			headerName: 'Invoice date',
			headerClassName: classes.wrapText,
			width: 70,
			sortable: false,
			cellClassName: classes.wrapText,
			valueGetter: ({ row: invoice }: GridRenderCellParams) => getInvoiceProcessingDateString(invoice),
		},
		{
			field: 'payDate',
			headerName: 'Billing date',
			headerClassName: classes.wrapText,
			width: 70,
			sortable: false,
			hide: type === 'upcoming',
			cellClassName: classes.wrapText,
			valueGetter: ({ row: invoice }: GridRenderCellParams) => getInvoicePayDateString(invoice),
		},
		{
			field: 'checkedInAt',
			headerName: 'Date Checked in',
			width: 70,
			sortable: false,
			headerClassName: classes.wrapText,
			cellClassName: classes.wrapText,
			hide: type === 'upcoming',
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<>
					{invoice.space!.spaceType.logicType === SpaceTypeLogicType.MINUTELY &&
						dateWithTz(invoice.reservation?.hoursFrom, getReservationTz(invoice)).format('MMMM D, YYYY')}
				</>
			),
		},
		{
			field: 'checkInTime',
			headerName: 'Check In Time',
			headerClassName: classes.wrapText,
			width: 70,
			sortable: false,
			hide: type === 'upcoming',
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<>
					{invoice.space!.spaceType.logicType === SpaceTypeLogicType.MINUTELY &&
						dateWithTz(invoice.reservation?.hoursFrom, getReservationTz(invoice)).format(getTimeFormat(invoice.reservation!))}
				</>
			),
		},
		{
			field: 'invoiceNumber',
			headerName: 'Invoice #',
			width: 150,
			sortable: false,
			valueGetter: ({ row: invoice }: GridRenderCellParams) => getInvoiceNumber(invoice),
		},
		{
			field: 'total',
			headerName: 'Total',
			width: 90,
			sortable: false,
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<span
					style={{ whiteSpace: 'nowrap' }}
					dangerouslySetInnerHTML={{
						__html: getInvoiceFullPriceString(invoice),
					}}
				/>
			),
		},
		{
			field: 'invoiceStatus',
			headerName: 'Status',
			width: 80,
			sortable: false,
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<Typography component="p" style={{ color: getStatusColor(invoice.invoiceStatus!.name), fontSize: 15, paddingTop: 5 }}>
					{invoice.invoiceStatus!.name}
				</Typography>
			),
		},
		{
			field: 'creditsUsed',
			headerName: 'Credits used',
			headerClassName: classes.wrapText,
			width: 70,
			sortable: false,
			hide: type === 'upcoming',
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<>
					{[SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(invoice.space!.spaceType.logicType) &&
						getInvoiceCredits(invoice)}
				</>
			),
		},

		{
			field: 'actions',
			sortable: false,
			flex: 1,
			headerName: '',
			align: 'right',
			valueGetter: ({ row: invoice }: GridRenderCellParams) => (
				<IconButton color="primary" onClick={() => handleShowPreview(invoice.id!)}>
					<ChevronRightIcon />
				</IconButton>
			),
		},
	];

	const doSearch = async (filters: any) =>
		invoiceService.list({ ...filters, invoiceStatusIds: type === 'upcoming' ? upcomingStatusIds : pastStatusIds, userId: user.id });

	return (
		<>
			{statusList.length > 0 && <TableComponent doSearch={doSearch} filters={{}} columns={columns} disableColumnMenu disableColumnFilter />}

			<Dialog
				onClose={handlePreviewClose}
				open={previewVisible}
				maxWidth={isMobile ? false : 'md'}
				fullWidth={isMobile}
				className={classes.dialog}
			>
				<DialogContent>
					<InvoiceViewComponent
						invoiceId={previewInvoice}
						user={user}
						onClose={handlePreviewClose}
						doBgRefresh={() => loadStatusList().then()}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
