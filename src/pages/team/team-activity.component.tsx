import React, { useCallback, useContext, useEffect, useState } from 'react';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import Button from '@mui/material/Button';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import InvoiceItemInterface, { InvoiceItemType } from 'dd-common-blocks/dist/interface/invoice-item.interface';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import InvoiceStatusInterface from 'dd-common-blocks/dist/interface/invoice-status.interface';
import { AuthContext } from '@context/auth.context';
import { getCurrencySymbol, getInvoiceNumber, SecondsToTimeHelper } from 'dd-common-blocks';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { addCellToSheet } from '@helpers/xlsx.helper';
import InvoiceService from '@service/invoice.service';
import TeamActivityTableComponent from './team-activity-table.component';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		exportBtn: {
			position: 'absolute',
			top: 2,
			right: 10,
			[theme.breakpoints.down('md')]: {
				top: -60,
				right: 'auto',
				width: '100%',
			},
		},
	})
);

export default function TeamActivityComponent({ team, activityDate }: { team: TeamInterface; activityDate: { endDate?: Date; startDate?: Date } }) {
	const invoiceService = new InvoiceService();
	const classes = useStyles();
	const { isSuperAdmin, authBody, isBrandAdmin } = useContext(AuthContext);

	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState<number>(5);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [data, setData] = useState<InvoiceInterface[]>([]);
	const [params, setParams] = useState({});

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [statusList] = await invoiceService.statusList();

			const queryParams: any = {
				...params,
				dateFrom: dayjs(activityDate.startDate).startOf('day').format(),
				dateTo: dayjs(activityDate.endDate).endOf('day').format(),
				limit: itemsPerPage,
				offset: itemsPerPage * pageNumber,
				teamId: team.id,
				// userId: authBody?.id,
				invoiceStatusIds: statusList
					.filter((i: InvoiceStatusInterface) => !['Upcoming', 'Upcoming-Hours'].includes(i.name))
					.map((i: InvoiceStatusInterface) => Number(i.id)),
			};

			if (team.teamLeadId !== authBody?.id) {
				queryParams.userId = authBody?.id;
			}

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
	}, [params, team, activityDate]);

	useEffect(() => {
		loadData().then();
	}, [params, team, activityDate]);

	useEffect(() => {
		const newParams = Object.assign(params, {
			limit: itemsPerPage,
			offset: itemsPerPage * pageNumber,
		});
		if (JSON.stringify(params) !== JSON.stringify(newParams)) {
			newParams.offset = 0;
		}
		setParams({ ...newParams });
	}, [itemsPerPage, pageNumber]);

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

		let totalConfCreditHoursUsed = 0;
		let totalDropCreditHoursUsed = 0;

		const exportData = data.map((d: InvoiceInterface) => {
			const { currency, reservation } = d;
			const { chargeType, hoursFrom, hoursTo, bookedAt, tzLocation, tzUser } = reservation!;
			const { name: spaceName, spaceType } = d.space!;
			const { name: venueName, address: venueAddress } = d.venue!;
			const { firstname, lastname } = reservation!.reservedTo!;
			const { firstname: createdByFirstName, lastname: createdByLastName } = d.createdBy!;

			const status = d.invoiceStatus!.name;

			const isUSA = tzLocation.indexOf('America') !== -1;
			const timeFormat = isUSA ? 'hh:mm A' : 'HH:mm';

			const invoiceSpaceLine = d.items!.find((i: Partial<InvoiceItemInterface>) => i.invoiceItemType === InvoiceItemType.SPACE);

			let dropCredits = 0;
			let confCredits = 0;
			if (invoiceSpaceLine && invoiceSpaceLine.creditHours) {
				if ([SpaceTypeLogicType.MINUTELY].includes(spaceType.logicType)) {
					totalDropCreditHoursUsed += invoiceSpaceLine.creditHours;
					dropCredits += invoiceSpaceLine.creditHours;
				} else {
					totalConfCreditHoursUsed += invoiceSpaceLine.creditHours;
					confCredits += invoiceSpaceLine.creditHours;
				}
			}

			return {
				'Venue name': venueName,
				'Venue address': venueAddress,
				'Team name': team.name,
				'Space currency': currency,
				'Activity status': status,
				'Activity price': `${decodeHTML(getCurrencySymbol(currency))}${d.reservation!.price.toFixed(2)}`,
				'Check-in used credit hours': SecondsToTimeHelper(dropCredits * 60 * 60),
				'Conf used credit hours': SecondsToTimeHelper(confCredits * 60 * 60),
				'Venue time zone': tzLocation,
				'Customer time zone': tzUser,
				'Space name': spaceName,
				'Charge type': chargeType,
				'Booked for date': dayjs.tz(hoursFrom).format('dddd MMMM D, YYYY'),
				'Booked for time': `${dayjs(hoursFrom).format(timeFormat)} - ${dayjs(hoursTo).format(timeFormat)}`,
				'Booked at': dayjs.tz(bookedAt).format('dddd MMMM D, YYYY'),
				'Invoice number': getInvoiceNumber(d),
				'Reserved to': `${firstname} ${lastname}`,
				'Created by': `${createdByFirstName} ${createdByLastName}`,
			};
		});

		const ws = xlsx.utils.json_to_sheet(exportData);

		const range = xlsx.utils.decode_range(ws['!ref']);
		// note: range.s.r + 1 skips the header row
		for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
			const priceRef = xlsx.utils.encode_cell({ r: row, c: 5 });
			const dropinRef = xlsx.utils.encode_cell({ r: row, c: 6 });
			const confRef = xlsx.utils.encode_cell({ r: row, c: 7 });

			const invoiceSpaceLine = data[row - 1].items!.find((i: Partial<InvoiceItemInterface>) => i.invoiceItemType === InvoiceItemType.SPACE);

			let dropCredits = 0;
			let confCredits = 0;
			if (invoiceSpaceLine && invoiceSpaceLine.creditHours) {
				if ([SpaceTypeLogicType.MINUTELY].includes(data[row - 1].space!.spaceType.logicType)) {
					dropCredits += invoiceSpaceLine.creditHours;
				} else {
					confCredits += invoiceSpaceLine.creditHours;
				}
			}

			ws[priceRef] = {
				t: 'n',
				v: data[row - 1].reservation!.price.toFixed(2) || 0,
				z: `[$${data[row - 1].currency}]#,##0.00`,
			};
			ws[dropinRef] = {
				t: 'n',
				v: dropCredits,
				s: { numFmt: 'h:mm' },
				// z: '0:00',
			};
			ws[confRef] = {
				t: 'n',
				v: confCredits,
				s: { numFmt: 'h:mm' },
				// z: 'hh:mm',
			};
		}

		const wb = xlsx.utils.book_new();

		addCellToSheet(ws, `A${exportData.length + 6}`, 'Total check-in used credit hours', xlsx);
		addCellToSheet(ws, `B${exportData.length + 6}`, totalDropCreditHoursUsed, xlsx, 'h:mm');

		addCellToSheet(ws, `A${exportData.length + 7}`, 'Total conf used credit hours', xlsx);
		addCellToSheet(ws, `B${exportData.length + 7}`, totalConfCreditHoursUsed, xlsx, 'h:mm');

		xlsx.utils.book_append_sheet(wb, ws, 'Team activity');
		xlsx.writeFile(
			wb,
			`${team.name}_activity_${dayjs(activityDate.startDate).format('YYYY-MM-DD')}_${dayjs(activityDate.endDate).format('YYYY-MM-DD')}.xlsx`
		);
		setIsLoading(false);
	};

	return (
		<>
			{(isBrandAdmin || isSuperAdmin || (authBody?.leadingTeams && authBody?.leadingTeams.length > 0)) && (
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
			<TeamActivityTableComponent onPageChange={handlePageChange} isLoading={isLoading} data={data} total={totalCount} error={error} />
		</>
	);
}
