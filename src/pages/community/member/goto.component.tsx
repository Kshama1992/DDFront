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
import PauseIcon from '@mui/icons-material/Pause';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import BrandRoleType from 'dd-common-blocks/dist/type/BrandRoleType';
import UserStatus from 'dd-common-blocks/dist/type/UserStatus';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import UserService from '@service/user.service';
import RoleService from '@service/role.service';
import ConfirmDialog from '@shared-components/confirm.dialog';

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
		formControl: {
			width: '100%',
		},
	})
);

export default function GoTo({ user, doRefresh }: { user: UserInterface; doRefresh: () => any }) {
	const classes = useStyles({});
	const userService = new UserService();
	const roleService = new RoleService();
	const { isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const isAdmin = isBrandAdmin || isSuperAdmin;

	const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] = useState<boolean>(false);
	const [confirmMoveOutDialogVisible, setConfirmMoveOutDialogVisible] = useState<boolean>(false);
	const [confirmSuspendDialogVisible, setConfirmSuspendDialogVisible] = useState<boolean>(false);

	const [confirmMakeUnMakeDialogVisible, setConfirmMakeUnMakeDialogVisible] = useState<boolean>(false);

	const [rolesList, setRolesList] = useState<BrandRoleInterface[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>('');

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMoveout = async () => {
		handleClose();
		try {
			if (user.status !== UserStatus.MOVEOUT) {
				await userService.moveOut(user.id);
			} else {
				await userService.activate(user.id);
			}
			showSnackBar('Done');
			if (doRefresh) doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setConfirmMoveOutDialogVisible(false);
		}
	};

	const handleSuspend = async () => {
		handleClose();
		try {
			if (user.status !== UserStatus.SUSPENDED) {
				await userService.suspend(user.id);
			} else {
				await userService.activate(user.id);
			}
			showSnackBar('Done');
			if (doRefresh) doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setConfirmSuspendDialogVisible(false);
		}
	};

	const handleDelete = async () => {
		handleClose();
		try {
			await userService.delete(user.id);
			showSnackBar('Done');
			doRefresh();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
		setConfirmDeleteDialogVisible(false);
	};

	const handleMakeUnMakeAdminFromDialog = async () => {
		if (typeof selectedRole === 'undefined') {
			showSnackBar('Please select role first');
			return;
		}
		const itemId = user && user.id ? user.id : null;
		await userService.save({ isAdmin: !user?.isAdmin, roleId: Number(selectedRole) }, itemId);
		doRefresh();
		setConfirmMakeUnMakeDialogVisible(false);
	};

	const handleMakeUnMakeAdmin = async () => {
		try {
			const itemId = user && user.id ? user.id : null;

			const [roles] = await roleService.list({
				brandId: user?.brandId,
				limit: 50,
				type: !user?.isAdmin ? BrandRoleType.ADMIN : BrandRoleType.MEMBER,
			});

			if (roles.length === 1) {
				await userService.save({ isAdmin: !user?.isAdmin, roleId: roles[0].id }, itemId);
				doRefresh();
			} else {
				setRolesList(roles);
				setConfirmMakeUnMakeDialogVisible(true);
			}
		} catch (e) {
			console.error(e);
		} finally {
			handleClose();
		}
	};

	const handleChangeRole = (event: SelectChangeEvent) => {
		setSelectedRole(event.target.value as string);
	};

	return (
		<>
			<Typography
				className={classes.gotoBtn}
				component={Link}
				to={`${isAdmin ? '/dashboard' : ''}/community/members/${user.id}`}
				color="primary"
			>
				View Details <ChevronRightIcon className={classes.gotoBtnIcon} />
			</Typography>

			{(isSuperAdmin || isBrandAdmin) && (
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
						<MenuItem onClick={() => setConfirmSuspendDialogVisible(true)}>
							<PauseIcon className={classes.iconSuspend} />
							{user.status === UserStatus.SUSPENDED ? 'Reactivate ' : 'Suspend '}
						</MenuItem>
						<MenuItem onClick={() => setConfirmMoveOutDialogVisible(true)}>
							<ExitToAppIcon className={classes.iconMoveOut} />
							{user.status === UserStatus.MOVEOUT ? 'Reactivate' : 'Deactivate'}
						</MenuItem>

						<MenuItem onClick={handleMakeUnMakeAdmin}>
							<StarIcon className={classes.iconMakeAdmin} />
							{user && user.isAdmin ? 'Unmake Admin' : 'Make Admin'}
						</MenuItem>
						<MenuItem onClick={() => setConfirmDeleteDialogVisible(true)} disabled={user.status === UserStatus.DELETED}>
							<DeleteIcon className={classes.iconDelete} /> Delete
						</MenuItem>
					</Menu>

					<ConfirmDialog
						actionText="Delete"
						text={`Are you sure you want to delete ${user.firstname} ${user.lastname}?`}
						open={confirmDeleteDialogVisible}
						onClose={() => setConfirmDeleteDialogVisible(false)}
						action={handleDelete}
					/>

					<ConfirmDialog
						actionText={user.status === UserStatus.MOVEOUT ? 'Reactivate' : 'Deactivate'}
						text={`Are you sure you want to ${user.status === UserStatus.MOVEOUT ? 'reactivate' : 'deactivate'} ${user.firstname} ${
							user.lastname
						}?`}
						open={confirmMoveOutDialogVisible}
						onClose={() => setConfirmMoveOutDialogVisible(false)}
						action={handleMoveout}
					/>

					<ConfirmDialog
						actionText={user.status === UserStatus.SUSPENDED ? 'Reactivate ' : 'Suspend '}
						text={`Are you sure you want to ${user.status === UserStatus.SUSPENDED ? 'reactivate ' : 'suspend '} ${user.firstname} ${
							user.lastname
						}?`}
						open={confirmSuspendDialogVisible}
						onClose={() => setConfirmSuspendDialogVisible(false)}
						action={handleSuspend}
					/>

					<Dialog
						open={confirmMakeUnMakeDialogVisible}
						onClose={() => setConfirmMakeUnMakeDialogVisible(false)}
						aria-labelledby="alert-dialog-title"
						maxWidth="sm"
						fullWidth
						aria-describedby="alert-dialog-description"
					>
						<DialogContent>
							<FormControl className={classes.formControl}>
								<InputLabel id="demo-simple-select-label">Select role</InputLabel>
								<Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedRole} onChange={handleChangeRole}>
									{rolesList.map((r) => (
										<MenuItem key={r.id} value={r.id}>
											{r.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setConfirmMakeUnMakeDialogVisible(false)} color="primary">
								Cancel
							</Button>
							<Button onClick={handleMakeUnMakeAdminFromDialog} color="primary" autoFocus>
								Ok
							</Button>
						</DialogActions>
					</Dialog>
				</>
			)}
		</>
	);
}
