import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import VenueTypeService from '@service/venue-type.service';
import FormVenueTypeComponent from '@forms/form-venue-type.component';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';

export default function VenueTypeListComponent() {
	const venueTypeService = new VenueTypeService();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingVenueType, setEditingVenueType] = useState<VenueTypeInterface>();

	const handleClose = () => {
		setIsEditOpen(false);
		setEditingVenueType(undefined);
	};

	const handleSave = () => {
		setIsEditOpen(false);
		setEditingVenueType(undefined);
	};

	const handleEdit = (venueType?: VenueTypeInterface | undefined) => {
		setIsEditOpen(true);
		setEditingVenueType(venueType);
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
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<>
						<IconButton color="primary" onClick={() => handleEdit(row)} size="large">
							<EditIcon />
						</IconButton>
					</>
				);
			},
		},
	];

	const doSearch = async (filters: any) => venueTypeService.list(filters);

	return (
		<div style={{ position: 'relative' }}>
			<Button
				variant="outlined"
				onClick={() => handleEdit()}
				color="primary"
				endIcon={<AddIcon />}
				size="large"
				style={{ top: -55, right: 0, position: 'absolute' }}
			>
				Create venue type
			</Button>

			<Paper>
				<TableComponent doSearch={doSearch} columns={columns} disableColumnMenu disableColumnFilter title="Venue types" />
			</Paper>

			<br />

			<Dialog onClose={handleClose} open={isEditOpen}>
				<DialogTitle>Edit Venue Type</DialogTitle>
				<DialogContent>
					<FormVenueTypeComponent onSave={handleSave} onCancel={handleClose} initialValues={editingVenueType || undefined} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
