import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import TableHead from '@mui/material/TableHead';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import TeamActivityRowComponent from './team-activity-row.component';
import ActivityRowHeadersComponent from '../activity/row-header.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		loaderWrapper: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(255,255,255,0.31)',
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		noItemsText: {
			width: '100%',
			textAlign: 'center',
			padding: 15,
			boxSizing: 'border-box',
		},
		tableContainer: {
			height: 'calc(100vh - 261px)',
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				marginTop: 30,
			},
		},
		tableHead: {
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
	})
);

export default function TeamActivityTableComponent({
	onPageChange,
	isLoading,
	itemsPerPage = 5,
	error,
	data = [],
	total = 0,
}: {
	isLoading: boolean;
	itemsPerPage?: number;
	error?: Error;
	data: InvoiceInterface[];
	total?: number;
	onPageChange?: ({ page, perPage }: { page: number; perPage: number }) => any;
}) {
	const classes = useStyles({});
	const [perPage, setPerPage] = useState<number>(itemsPerPage);
	const [pageNumber, setPageNumber] = useState<number>(0);

	const handlePerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPerPage(+event.target.value);
		setPageNumber(0);
		if (onPageChange) onPageChange({ page: 0, perPage: +event.target.value });
	};

	const handlePageChange = (event: unknown, newPageNumber: number) => {
		setPageNumber(newPageNumber);
		if (onPageChange) onPageChange({ page: newPageNumber, perPage });
	};

	return (
		<>
			<TableContainer className={classes.tableContainer}>
				<Table stickyHeader>
					<TableHead className={classes.tableHead}>
						<ActivityRowHeadersComponent showCreditHours={true} />
					</TableHead>

					<TableBody>
						{data && data.map((invoice: InvoiceInterface) => <TeamActivityRowComponent key={invoice.id} invoice={invoice} />)}
					</TableBody>
				</Table>
				{!isLoading && data.length === 0 && <Typography className={classes.noItemsText}>No Items</Typography>}
				{!isLoading && error && (
					<Typography className={classes.noItemsText}>
						<>Error: {error}</>
					</Typography>
				)}
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={Number(total)}
				rowsPerPage={perPage}
				page={pageNumber}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handlePerPageChange}
			/>

			{isLoading && (
				<div className={classes.loaderWrapper}>
					<CircularProgress />
				</div>
			)}
		</>
	);
}
