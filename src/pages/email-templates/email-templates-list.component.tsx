import React, { useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailTemplateInterface from 'dd-common-blocks/dist/interface/email-template.interface';
import { EmailFiltersContext } from '@context/email-filters.context';
import { useDebounce } from '@helpers/debounce.helper';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import EmailTemplateService from '@service/email-template.service';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent, { NestedValueGetter } from '@shared-components/table.component';

function Actions({ emailTemplate, onDeleteDone }: { emailTemplate: EmailTemplateInterface; onDeleteDone: () => any }) {
	const templateService = new EmailTemplateService();
	const { showSnackBar } = useContext(SnackBarContext);
	const { isSuperAdmin, isBrandAdmin } = useContext(AuthContext);

	const [deleting, setDeleting] = useState<EmailTemplateInterface | undefined>();

	const closeDialog = () => {
		setDeleting(undefined);
	};

	const onDelete = async (a: EmailTemplateInterface) => {
		setDeleting(a);
	};

	const handleDelete = async () => {
		try {
			if (deleting) await templateService.delete(deleting.id);
			closeDialog();
			onDeleteDone();
		} catch (e) {
			showSnackBar((e as Error).message);
		}
	};

	return (
		<>
			{(isSuperAdmin || (emailTemplate.brand && isBrandAdmin)) && (
				<IconButton color="primary" component={Link} to={`/dashboard/email-templates/${emailTemplate.id}`} size="large">
					<EditIcon />
				</IconButton>
			)}
			{!emailTemplate.brand && isBrandAdmin && (
				<IconButton color="primary" component={Link} to={`/dashboard/email-templates/${emailTemplate.id}`} size="large">
					<VisibilityIcon />
				</IconButton>
			)}
			{emailTemplate.brand && (
				<IconButton color="secondary" onClick={() => onDelete(emailTemplate)} size="large">
					<DeleteIcon />
				</IconButton>
			)}

			<Dialog open={!!deleting} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Are you sure to delete {deleting?.name}?</DialogTitle>
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

export default function EmailTemplatesListComponent() {
	const templatesService = new EmailTemplateService();

	const { emailFilters, setEmailFilters } = useContext(EmailFiltersContext);

	const filtersDebounced = useDebounce(emailFilters, 500);

	const handleDelete = () => {
		setEmailFilters({ type: 'searchString', payload: '' });
	};

	const columns: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 1,
			sortable: false,
		},
		{
			field: 'emailTemplateType.name',
			headerName: 'Type',
			flex: 1,
			sortable: false,
			valueGetter: NestedValueGetter,
		},
		{
			field: 'brand.name',
			headerName: 'Brand name',
			width: 100,
			sortable: false,
			valueGetter: (p) => (NestedValueGetter(p) === undefined ? 'Default' : NestedValueGetter(p)),
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 100,
			sortable: false,
		},
		{
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row: emailTemplate } = cellParams;
				return <Actions emailTemplate={emailTemplate} onDeleteDone={handleDelete} />;
			},
		},
	];

	const doSearch = async (filters: any) => templatesService.list(filters);

	return (
		<Paper>
			<TableComponent
				doSearch={doSearch}
				filters={filtersDebounced}
				columns={columns}
				disableColumnMenu
				disableColumnFilter
				title="Email templates"
			/>
		</Paper>
	);
}
