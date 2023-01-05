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
import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import EmailTemplateTypeService from '@service/email-template-type.service';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';

export default function EmailTemplateTypeListComponent() {
	const templateService = new EmailTemplateTypeService();
	const [isDeleting, setDeletingActivity] = useState<EmailTemplateTypeInterface | undefined>();
	const { showSnackBar } = useContext(SnackBarContext);

	const closeDialog = () => {
		setDeletingActivity(undefined);
	};

	const handleDelete = async () => {
		try {
			if (isDeleting) await templateService.delete(isDeleting.id);
			closeDialog();
		} catch (e) {
			showSnackBar((e as Error).message);
		}
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
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: ({ row: type }: GridRenderCellParams) => {
				return (
					<>
						<IconButton
							aria-label="expand row"
							size="small"
							color="primary"
							component={Link}
							to={`/dashboard/email-template-type/${type.id}`}
							style={{ marginRight: 15 }}
						>
							<EditIcon />
						</IconButton>
						<IconButton aria-label="expand row" size="small" color="secondary">
							<DeleteIcon />
						</IconButton>
					</>
				);
			},
		},
	];

	const doSearch = async (filters: any) => templateService.list();

	return (
		<>
			<Paper>
				<TableComponent doSearch={doSearch} columns={columns} disableColumnMenu disableColumnFilter title="Email template type" />
			</Paper>

			<Dialog open={!!isDeleting} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
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
