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
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';
import { AuthContext } from '@context/auth.context';
import GroupService from '@service/group.service';

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

export default function GoTo({ group, onDelete }: { group: GroupInterface; onDelete: (id: number | undefined) => void }) {
	const classes = useStyles({});
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const isAdmin = isBrandAdmin || isSuperAdmin;

	const groupService = new GroupService();

	const [dialogCallback, setDialogCallback] = useState<boolean>(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteGroup = async () => {
		setDialogCallback(true);
		setDialogOpen(true);
	};

	const closeDialog = () => {
		setDialogCallback(false);
		setDialogOpen(false);
		handleClose();
	};

	const dialogAgree = async () => {
		if (dialogCallback !== null) {
			await groupService.delete(group.id);
		}
		onDelete(group.id);
		closeDialog();
	};

	return (
		<>
			<Typography
				className={classes.gotoBtn}
				component={Link}
				to={`${isAdmin ? '/dashboard' : ''}/community/groups/${group.id}`}
				color="primary"
			>
				View Details <ChevronRightIcon className={classes.gotoBtnIcon} />
			</Typography>

			{(isSuperAdmin || isBrandAdmin || authBody?.id === group.createdById) && (
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
						<MenuItem onClick={deleteGroup}>
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
