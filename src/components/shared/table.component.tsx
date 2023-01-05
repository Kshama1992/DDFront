import React, { useCallback, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, getGridStringOperators, GridCellParams, GridColDef, GridFilterModel, GridToolbarContainer } from '@mui/x-data-grid';
import { useDebounce, useDebounceEffect } from '@helpers/debounce.helper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import JSONflatten from '@helpers/json-flatten.helper';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface TableComponentProps {
	columns: GridColDef[];
	checkboxSelection?: boolean;
	disableColumnMenu?: boolean;
	disableColumnSelector?: boolean;
	disableColumnFilter?: boolean;
	filters?: any;
	title?: string;
	showSearch?: boolean;
	doSearch: (filterParams: any) => Promise<[any[], number]>;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {
			background: 'white',
		},
		root: {
			'& .MuiDataGrid-columnSeparator': { display: 'none' },
			'& .MuiDataGrid-columnHeaderTitle': { fontSize: 12, fontWeight: 300 },
			'& .MuiDataGrid-cell': {
				[theme.breakpoints.down('md')]: {
					maxWidth: '100% !important',
					maxHeight: 'fit-content !important',
					width: '100%',
					display: 'inline-block',
				},
			},
			'& .MuiDataGrid-row': {
				[theme.breakpoints.down('md')]: {
					maxWidth: '100% !important',
					maxHeight: 'fit-content !important',
					display: 'inline-block',
					paddingTop: 10,
					borderBottom: '1px solid',
				},
			},
			'& .MuiDataGrid-virtualScroller': {
				[theme.breakpoints.down('md')]: {
					// maxWidth: '100%',
				},
			},
		},
		headerText: { fontSize: 12, fontWeight: 300 },
		headerTextMobile: { fontSize: 15, fontWeight: 600, display: 'inline-block', width: '100%', textAlign: 'center' },
		valueText: { fontSize: 15, fontWeight: 300 },
		valueTextMobile: { fontSize: 15, fontWeight: 300, display: 'inline-block', width: '100%', textAlign: 'center' },
	})
);

const filterOperators = getGridStringOperators().filter(({ value }) => ['equals'].includes(value));

export function NestedValueGetter(params: any): any {
	const flatJson = JSONflatten(params.row);
	return flatJson[params.field];
}

export default function TableComponent({
	filters = {},
	doSearch,
	title,
	columns,
	showSearch = false,
	disableColumnMenu,
	disableColumnSelector,
	disableColumnFilter,
	checkboxSelection,
}: TableComponentProps) {
	const classes = useStyles();
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

	const modifiedColumns = columns.map((c) => ({
		...c,
		filterOperators,
		filterable: !['actions', 'id'].includes(c.field),
		renderCell: (p: any) => {
			if (isMobile)
				return (
					<>
						<Typography className={classes.headerTextMobile}>{p.colDef.headerName}</Typography>
						<br />
						<Typography className={classes.valueTextMobile}>{p.formattedValue}</Typography>
					</>
				);
			return <Typography className={classes.valueText}>{p.formattedValue}</Typography>;
		},
		renderHeader: (p: any) => (isMobile ? <></> : <Typography className={classes.headerText}>{p.colDef.headerName}</Typography>),
	}));
	const filtersDebounced = useDebounce(filters, 500);

	const [searchText, setSearchText] = useState<string>('');
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [params, setParams] = useState({ ...filtersDebounced, limit: pageSize, offset: pageSize * page });
	const [data, setData] = useState<any[]>([]);
	const [tableFilters, setTableFilters] = useState<any>();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [items, itemsCount] = await doSearch({ ...params });

			if (items) {
				setData(items);
				setTotal(itemsCount);
			}
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, [params]);

	const onFilterChange = useCallback((filterModel: GridFilterModel) => {
		const item = filterModel.items[0];
		const f: any = {};
		f[item.columnField] = item.value;
		setTableFilters(f);
	}, []);

	useDebounceEffect(
		() => {
			if (Object.keys(filters).length) setParams({ ...filters, offset: 0, limit: pageSize });
		},
		1000,
		[filters]
	);

	useEffect(() => {
		setIsLoading(true);
		const newParams = Object.assign(
			params,
			tableFilters
				? { ...filters, ...tableFilters, offset: 0, limit: pageSize }
				: {
						...filters,
						limit: pageSize,
						offset: pageSize * page,
				  }
		);
		if (JSON.stringify(params) !== JSON.stringify(newParams)) {
			newParams.offset = 0;
		}
		setParams({ ...newParams });
	}, [pageSize, page, tableFilters]);

	useEffect(() => {
		loadData().then();
	}, [params]);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value);
		setParams({ ...params, searchString: event.target.value, offset: 0 });
	};

	const getToolbar = () => {
		if (!title) return <></>;
		return (
			<GridToolbarContainer>
				<Toolbar style={{ justifyContent: 'space-between', width: '100%' }}>
					<Typography color="inherit" variant="subtitle1" component="div">
						{title}
					</Typography>

					{showSearch && (
						<TextField
							onChange={handleSearch}
							variant="standard"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
							value={searchText}
							placeholder="Search"
							defaultValue={filters.searchString || ''}
						/>
					)}
				</Toolbar>
			</GridToolbarContainer>
		);
	};

	return (
		<DataGrid
			className={classes.root}
			autoHeight
			error={error}
			page={page}
			rowHeight={84}
			rowCount={total}
			loading={isLoading}
			onPageChange={(newPage) => setPage(newPage)}
			rows={isLoading ? [] : data}
			columns={modifiedColumns}
			pageSize={pageSize}
			paginationMode="server"
			disableDensitySelector
			disableSelectionOnClick
			disableColumnMenu={disableColumnMenu}
			disableColumnSelector={disableColumnSelector}
			disableColumnFilter={disableColumnFilter}
			checkboxSelection={checkboxSelection}
			disableExtendRowFullWidth={true}
			onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
			rowsPerPageOptions={[5, 10, 25]}
			filterMode="server"
			hideFooterSelectedRowCount
			showColumnRightBorder={false}
			showCellRightBorder={false}
			onFilterModelChange={onFilterChange}
			componentsProps={{ filterPanel: { linkOperators: ['and'] } }}
			components={{
				Toolbar: getToolbar,
			}}
			getCellClassName={(cellParams: GridCellParams<number>) => classes.row}
		/>
	);
}
