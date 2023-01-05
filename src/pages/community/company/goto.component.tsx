import React, { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import { AuthContext } from '@context/auth.context';
import CompanyService from '@service/company.service';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		gotoBtn: {
			textDecoration: 'none',
			color: '#333',
			'&:hover': {
				color: theme.palette.primary.main,
			},
		},
		gotoBtnIcon: {
			color: theme.palette.primary.main,
			marginBottom: '-8px',
		},
		iconSuspend: {
			color: 'gray',
			marginRight: 5,
		},
		iconMoveOut: {
			color: theme.palette.primary.main,
			marginRight: 5,
		},
		iconMakeAdmin: {
			color: 'orange',
			marginRight: 5,
		},
		iconDelete: {
			color: 'red',
			marginRight: 5,
		},
	})
);

export default function GoTo({ company, onDelete }: { company: CompanyInterface; onDelete: (id: number | undefined) => void }) {
	const classes = useStyles({});
	const companyService = new CompanyService();

	const { authBody, isBrandAdmin, isSuperAdmin } = useContext(AuthContext);
	const isAdmin = isBrandAdmin || isSuperAdmin;

	const [dialogOpen, setDialogOpen] = useState(false);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteCompany = async () => {
		setDialogOpen(true);
	};

	const closeDialog = () => {
		setDialogOpen(false);
		handleClose();
	};

	const dialogAgree = async () => {
		await companyService.delete(company.id);
		onDelete(company.id);
		closeDialog();
	};

	return (
		<>
			<Typography
				className={classes.gotoBtn}
				component={Link}
				to={`${isAdmin ? '/dashboard' : ''}/community/companies/${company.id}`}
				color="primary"
			>
				View Details <ChevronRightIcon className={classes.gotoBtnIcon} />
			</Typography>

			{(isSuperAdmin || isBrandAdmin || authBody?.id === company.createdById) && (
				<>
					<IconButton onClick={handleMenu} aria-label="settings" size="large">
						<MoreVertIcon />
					</IconButton>

					<Menu
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={open}
						onClose={handleClose}
					>
						<MenuItem onClick={deleteCompany}>
							<DeleteIcon className={classes.iconDelete} /> Delete
						</MenuItem>
					</Menu>

					<Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
						<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
						<DialogActions>
							<Button onClick={closeDialog} color="primary">
								Cancel
							</Button>
							<Button onClick={dialogAgree} color="primary" autoFocus>
								Ok
							</Button>
						</DialogActions>
					</Dialog>
				</>
			)}
		</>
	);
}
