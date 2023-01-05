import React, { useCallback, useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { Theme, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import InvoiceItemInterface, { InvoiceItemType } from 'dd-common-blocks/dist/interface/invoice-item.interface';
import { ActivityFiltersContext } from '@context/activity-filters.context';
import { AuthContext } from '@context/auth.context';
import { debounce, useDebounce } from '@helpers/debounce.helper';
import { getCurrencySymbol, getInvoiceNumber, SecondsToTimeHelper } from 'dd-common-blocks';
import InvoiceStatusInterface from 'dd-common-blocks/dist/interface/invoice-status.interface';
import InvoiceService from '@service/invoice.service';
import { SnackBarContext } from '@context/snack-bar.context';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import ActivityTableComponent from './activity-table.component';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: '100%',
			'& .MuiInput-input': {
				border: 'none',
			},
			[theme.breakpoints.down('md')]: {
				marginTop: 30,
				position: 'relative',
			},
		},
		searchIcon: {
			color: theme.palette.primary.main,
		},
		exportBtn: {
			position: 'absolute',
			top: -55,
			right: 190,
			padding: '6px 16px',
			[theme.breakpoints.down('md')]: {
				width: '100%',
				right: 'auto',
				top: -45,
			},
		},
	})
);

export default function ActivityListComponent({ doReload }: { doReload: boolean }) {
	const classes = useStyles({});
	const invoiceService = new InvoiceService();
	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'));
	const { isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const { activityFilters, setActivityFilters } = useContext(ActivityFiltersContext);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState<number>(5);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [data, setData] = useState<InvoiceInterface[]>([]);
	const filtersDebounced = useDebounce(activityFilters, 500);
	const [params, setParams] = useState({
		...filtersDebounced,
	});

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [statusList] = await invoiceService.statusList();

			const queryParams: any = {
				...params,
				// dateFrom: dayjs(activityDate.startDate).startOf('day').format(),
				// dateTo: dayjs(activityDate.endDate).endOf('day').format(),
				limit: itemsPerPage,
				offset: itemsPerPage * pageNumber,
				// userId: authBody?.id,
				invoiceStatusIds: statusList
					.filter((i: InvoiceStatusInterface) => !['Upcoming', 'Upcoming-Hours'].includes(i.name))
					.map((i: InvoiceStatusInterface) => Number(i.id)),
			};

			const [items, count] = await invoiceService.list(queryParams);

			if (items) {
				setTotalCount(count);
				setData(items);
			}
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, [params]);

	useEffect(() => {
		loadData().then();
	}, [params, doReload]);

	useEffect(() => {
		const newParams = Object.assign(params, filtersDebounced, {
			limit: itemsPerPage,
			offset: itemsPerPage * pageNumber,
		});
		if (JSON.stringify(params) !== JSON.stringify(newParams)) {
			newParams.offset = 0;
		}
		setParams({ ...newParams });
	}, [filtersDebounced, itemsPerPage, pageNumber]);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
		debounce(setActivityFilters({ type: 'searchString', payload: event.target.value }), 700);

	const handlePageChange = ({ perPage, page }: { perPage: number; page: number }) => {
		if (itemsPerPage !== perPage) setItemsPerPage(perPage);
		if (pageNumber !== page) setPageNumber(page);
	};

	const decodeHTML = (html: string) => {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};

	const exportAsExcelFile = async () => {
		setIsLoading(true);
		const xlsx = await import('xlsx');

		try {
			const [statusList] = await invoiceService.statusList();

			const queryParams: any = {
				...params,
				limit: 999999,
				offset: 0,
				invoiceStatusIds: statusList
					.filter((i: InvoiceStatusInterface) => !['Upcoming', 'Upcoming-Hours'].includes(i.name))
					.map((i: InvoiceStatusInterface) => Number(i.id)),
			};

			const [items] = await invoiceService.list(queryParams);

			const exportData = items.map((d, i) => {
				const { currency, reservation, subTotal, tax } = d;
				const { chargeType, hoursFrom, hoursTo, bookedAt, tzLocation, tzUser } = reservation!;
				const {
					name: spaceName,
					spaceType: { name: spaceTypeName, logicType: spaceTypeLogic },
				} = d.space!;
				const { name: venueName } = d.venue!;
				const { firstname, lastname, email, phone } = reservation!.reservedTo!;
				const { firstname: createdByFirstName, lastname: createdByLastName } = d.createdBy!;

				const status = d.invoiceStatus!.name;

				const isUSA = tzLocation.indexOf('America') !== -1;
				const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

				const invoiceSpaceLine = d.items!.find((i1: Partial<InvoiceItemInterface>) => i1.invoiceItemType === InvoiceItemType.SPACE);

				let hoursFromString = 'N/A';
				let hoursToString = 'N/A';
				if (spaceTypeLogic && [SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(spaceTypeLogic)) {
					const from = dayjs(hoursFrom).tz(tzLocation);
					const to = dayjs(hoursTo).tz(tzLocation);
					hoursFromString = `${from.format('D MMM YYYY')} ${from.format(timeFormat)}`;
					hoursToString = `${from.format('D MMM YYYY')} ${hoursTo ? to.format(timeFormat) : 'Ongoing'}`;
				}
				return {
					'#': i + 1,
					'Space name': spaceName,
					'Booked by': `${createdByFirstName} ${createdByLastName}`,
					'Booked for': `${firstname} ${lastname}`,
					'Venue name': venueName,
					Price: 0,
					// Price: `${decodeHTML(getCurrencySymbol(currency))}${price.toFixed(2)}`,
					Status: status,
					'Created by': `${createdByFirstName} ${createdByLastName}`,
					'Booked at': dayjs.tz(bookedAt).format('dddd MMMM D, YYYY'),
					'Charge type': chargeType,
					'Space type': spaceTypeName,
					'Space TZ': tzLocation,
					'Customer email': email,
					'Customer phone': phone,
					'Customer time zone': tzUser,

					'Invoice number': getInvoiceNumber(d),
					'Invoice subtotal': `${decodeHTML(getCurrencySymbol(currency))}${subTotal.toFixed(2)}`,
					'Invoice tax': `${decodeHTML(getCurrencySymbol(currency))}${tax.toFixed(2)}`,

					'Total duration':
						spaceTypeLogic && [SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(spaceTypeLogic)
							? `${SecondsToTimeHelper(invoiceSpaceLine && invoiceSpaceLine.quantity ? invoiceSpaceLine.quantity * 60 * 60 : 0)}`
							: 'N/A',

					'Used credit hours':
						spaceTypeLogic && [SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(spaceTypeLogic)
							? SecondsToTimeHelper(invoiceSpaceLine && invoiceSpaceLine.creditHours ? invoiceSpaceLine.creditHours * 60 * 60 : 0)
							: 'N/A',
					'Hours from': hoursFromString,
					'Hours to': hoursToString,
				};
			});

			const ws = xlsx.utils.json_to_sheet(exportData);

			// @ts-ignore
			const range = xlsx.utils.decode_range(ws['!ref']);
			// note: range.s.r + 1 skips the header row
			for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
				const priceRef = xlsx.utils.encode_cell({ r: row, c: 5 });
				const subtotalRef = xlsx.utils.encode_cell({ r: row, c: 16 });
				const taxRef = xlsx.utils.encode_cell({ r: row, c: 17 });
				ws[priceRef] = {
					t: 'n',
					v: items[row - 1].reservation.price.toFixed(2) || 0,
					z: `[$${items[row - 1].currency}]#,##0.00`,
				};
				ws[subtotalRef] = {
					t: 'n',
					v: items[row - 1].subTotal.toFixed(2) || 0,
					z: `[$${items[row - 1].currency}]#,##0.00`,
				};
				ws[taxRef] = {
					t: 'n',
					v: items[row - 1].tax.toFixed(2) || 0,
					z: `[$${items[row - 1].currency}]#,##0.00`,
				};
			}

			ws['!cols'] = [
				{ width: 5 },
				{ width: 40 },
				{ width: 20 },
				{ width: 20 },
				{ width: 40 },
				{ width: 10 },
				{ width: 15 },
				{ width: 20 },
				{ width: 30 },
				{ width: 10 },
				{ width: 15 },
				{ width: 20 }, // space tz
				{ width: 20 }, // email
				{ width: 15 }, // phone
				{ width: 20 }, // cust tz
				{ width: 10 }, // inv num
				{ width: 15 }, // inv subt
				{ width: 15 }, // inv tax
				{ width: 15 }, // duration
				{ width: 15 }, // used creds
				{ width: 30 }, // hours from
				{ width: 30 }, // hours to
			];

			const wb = xlsx.utils.book_new();

			xlsx.utils.book_append_sheet(wb, ws, 'Activity');
			xlsx.writeFile(wb, `Activity.xlsx`);
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{(isBrandAdmin || isSuperAdmin) && (
				<Button
					startIcon={<ImportExportIcon />}
					variant="outlined"
					color="primary"
					className={classes.exportBtn}
					onClick={() => exportAsExcelFile()}
				>
					Export activities
				</Button>
			)}

			<Paper className={classes.root}>
				{!isPhone && (
					<Paper>
						<Toolbar style={{ justifyContent: 'space-between' }}>
							<Typography color="inherit" variant="subtitle1" component="div">
								Activity Calendar
							</Typography>

							<Grid container spacing={1} alignItems="flex-end" direction="row-reverse" style={{ width: '50%' }}>
								<Grid item>
									<SearchIcon className={classes.searchIcon} />
								</Grid>
								<Grid item>
									<TextField variant="standard" onChange={handleSearch} placeholder="Search" value={activityFilters.searchString} />
								</Grid>
							</Grid>
						</Toolbar>
					</Paper>
				)}

				<ActivityTableComponent onPageChange={handlePageChange} isLoading={isLoading} data={data} total={totalCount} error={error} />
			</Paper>
		</>
	);
}
