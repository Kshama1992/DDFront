import React from 'react';
import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import TableComponent, { NestedValueGetter } from '@shared-components/table.component';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import LogService from '@service/log.service';

export default function LogEmailListComponent() {
	const logService = new LogService();

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', sortable: false, width: 90 },
		{
			field: 'brand.name',
			headerName: 'Brand',
			flex: 1,
			sortable: false,
			editable: false,
			valueGetter: NestedValueGetter,
		},
		{
			field: 'from',
			headerName: 'From',
			sortable: false,
			flex: 1,
			editable: false,
		},
		{
			field: 'to',
			headerName: 'To',
			sortable: false,
			flex: 1,
			// editable: false,
		},
		{
			field: 'actions',
			sortable: false,
			headerName: '',
			valueGetter: (params: GridRenderCellParams) => (
				<IconButton
					aria-label="view log"
					title="View log"
					size="small"
					color="primary"
					component={Link}
					to={`/dashboard/log-email/${params.id}`}
					style={{ marginRight: 15 }}
				>
					<VisibilityIcon />
				</IconButton>
			),
		},
	];

	const doSearch = async (filters: any) => logService.listEmailLogs(filters);

	return (
		<>
			<Paper>
				<TableComponent doSearch={doSearch} columns={columns} title="Application email logs" />
			</Paper>

			<br />
		</>
	);
}
