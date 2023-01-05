import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeService from '@service/space-type.service';
import FormSpaceTypeComponent from '@forms/form-space-type.component';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';

export default function SpaceTypeListComponent() {
	const [isEditOpen, setIsEditOpen] = useState(true);
	const [editingSpaceType, setEditingSpaceType] = useState<SpaceTypeInterface>();
	const spaceTypeService = new SpaceTypeService();

	const handleClose = () => {
		setIsEditOpen(false);
		setEditingSpaceType(undefined);
	};

	const handleEditSpaceType = (spaceType: SpaceTypeInterface) => {
		setIsEditOpen(true);
		setEditingSpaceType(spaceType);
	};

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: '#',
			width: 30,
			sortable: false,
		},
		{
			field: 'name',
			headerName: 'Name',
			flex: 1,
			sortable: false,
		},
		{
			field: 'alias',
			headerName: 'Alias',
			flex: 1,
			sortable: false,
		},
		{
			field: 'color',
			headerName: 'Color',
			flex: 1,
			sortable: false,
		},
		{
			field: 'icon',
			headerName: 'Icon',
			flex: 1,
			sortable: false,
		},
		{
			field: 'brand',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: ({ row: spaceType }: GridRenderCellParams) => (spaceType.brand ? spaceType.brand.name : 'DropDesk'),
		},
		{
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: ({ row: spaceType }: GridRenderCellParams) => {
				return (
					<>
						<IconButton color="primary" onClick={() => handleEditSpaceType(spaceType)} size="large">
							<EditIcon />
						</IconButton>
					</>
				);
			},
		},
	];

	const doSearch = async (filters: any) => spaceTypeService.list(filters);

	return (
		<>
			<Paper>
				<TableComponent doSearch={doSearch} columns={columns} disableColumnMenu disableColumnFilter title="Space types" />
			</Paper>

			<Dialog onClose={handleClose} open={isEditOpen}>
				<DialogTitle id="simple-dialog-title">Edit Space Type</DialogTitle>
				<FormSpaceTypeComponent initialValues={editingSpaceType || undefined} />
			</Dialog>
		</>
	);
}
