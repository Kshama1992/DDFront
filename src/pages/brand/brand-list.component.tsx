import React, { useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import AvatarComponent from '@shared-components/avatar.component';
import { BrandFiltersContext } from '@context/brand-filters.context';
import { useDebounce } from '@helpers/debounce.helper';
import BrandService from '@service/brand.service';
import { SnackBarContext } from '@context/snack-bar.context';
import ConfirmDialog from '@shared-components/confirm.dialog';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		avatar: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				height: 150,
				borderRadius: 0,
			},
		},
	})
);

export default function BrandListComponent() {
	const classes = useStyles({});
	const brandService = new BrandService();
	const { showSnackBar } = useContext(SnackBarContext);
	const { brandFilters, setBrandFilters } = useContext(BrandFiltersContext);
	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);
	const [deletingBrand, setDeletingBrand] = useState<BrandInterface | undefined>(undefined);

	const filtersDebounced = useDebounce(brandFilters, 500);

	const handleDelete = async () => {
		setConfirmDialogVisible(false);
		try {
			if (typeof deletingBrand !== 'undefined') {
				await brandService.delete(deletingBrand.id);
				setBrandFilters({ type: 'searchString', payload: '' });
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	const columns: GridColDef[] = [
		{
			field: 'logo',
			headerName: 'Logo',
			width: 90,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row: brand } = cellParams;
				return (
					<AvatarComponent
						className={classes.avatar}
						src={brand.logo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${brand.logo.url}` : undefined}
						altText={brand.name}
					/>
				);
			},
		},
		{
			field: 'name',
			headerName: 'Name',
			flex: 1,
			sortable: false,
		},
		{
			field: 'domain',
			headerName: 'Domain',
			flex: 1,
			sortable: false,
		},
		{
			field: 'chargeCustomer',
			headerName: 'Charge customer',
			width: 120,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<>
						{row.chargeCustomer && <CheckIcon color="primary" />}
						{!row.chargeCustomer && <CloseIcon color="primary" />}
					</>
				);
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
						<IconButton size="small" color="primary" component={Link} to={`/dashboard/brand/${row.id}`} style={{ marginRight: 15 }}>
							<EditIcon />
						</IconButton>
						<IconButton
							size="small"
							color="secondary"
							onClick={() => {
								setDeletingBrand(row);
								setConfirmDialogVisible(true);
							}}
						>
							<DeleteIcon />
						</IconButton>
					</>
				);
			},
		},
	];

	const doSearch = async (filters: any) => brandService.list(filters);

	return (
		<>
			<Paper>
				<TableComponent
					doSearch={doSearch}
					filters={filtersDebounced}
					columns={columns}
					disableColumnMenu
					disableColumnFilter
					title="Brands"
				/>
			</Paper>

			<br />

			{deletingBrand && (
				<ConfirmDialog
					text={`Are you sure you want to delete ${deletingBrand.name}?`}
					open={confirmDialogVisible}
					onClose={() => setConfirmDialogVisible(false)}
					action={handleDelete}
				/>
			)}
		</>
	);
}
