import React, { useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import { useDebounce } from '@helpers/debounce.helper';
import { RoleFiltersContext } from '@context/role-filters.context';
import RoleService from '@service/role.service';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent, { NestedValueGetter } from '@shared-components/table.component';

export default function RoleListComponent() {
	const [isDeleting, setDeletingActivity] = useState<BrandRoleInterface | undefined>();
	const { showSnackBar } = useContext(SnackBarContext);

	const roleService = new RoleService();

	const { roleFilters, setRoleFilters } = useContext(RoleFiltersContext);
	const filtersDebounced = useDebounce(roleFilters, 500);

	const closeDialog = () => {
		setDeletingActivity(undefined);
	};

	const handleDelete = async () => {
		try {
			if (isDeleting) await roleService.delete(String(isDeleting.id));
			setRoleFilters({ type: 'searchString', payload: '' });
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			closeDialog();
		}
	};

	const columns: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 1,
			sortable: false,
		},
		{
			field: 'brand.name',
			headerName: 'Brand name',
			flex: 1,
			sortable: false,
			valueGetter: NestedValueGetter,
		},
		{
			field: 'roleType',
			headerName: 'Type',
			width: 120,
			sortable: false,
		},
		{
			field: 'usersCount',
			headerName: 'Users count',
			width: 120,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return row.users?.length || 0;
			},
		},
		{
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<>
						<IconButton
							aria-label="expand row"
							size="small"
							color="primary"
							component={Link}
							to={`/dashboard/role/${row.id}`}
							style={{ marginRight: 15 }}
						>
							<EditIcon />
						</IconButton>
						<IconButton aria-label="expand row" size="small" color="secondary" onClick={() => setDeletingActivity(row)}>
							<DeleteIcon />
						</IconButton>
					</>
				);
			},
		},
	];

	const doSearch = async (filters: any) => roleService.list(filters);

	return (
		<>
			<Paper>
				<TableComponent
					doSearch={doSearch}
					filters={filtersDebounced}
					columns={columns}
					disableColumnMenu
					disableColumnFilter
					title="Roles"
				/>
			</Paper>

			<br />

			<Dialog open={!!isDeleting} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Are you sure to delete {isDeleting?.name}?</DialogTitle>
				<DialogActions>
					<Button onClick={closeDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
