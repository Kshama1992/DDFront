import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import BrandRoleType from 'dd-common-blocks/dist/type/BrandRoleType';
import UserPermissionsInterface from 'dd-common-blocks/dist/interface/user-permission.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import SelectRoleTypeComponent from '@forms/elements/select-role-type.component';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import { AuthContext } from '@context/auth.context';
import RoleService from '@service/role.service';
import ConfirmDialog from '@shared-components/confirm.dialog';
import { capitalize } from '@mui/material/utils';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiFormLabel-root, & .MuiFormControlLabel-label': {
				textTransform: 'uppercase',
				fontSize: 12,
				fontWeight: 500,
				color: theme.palette.text.primary,
			},
			'& .MuiIconButton-label,& .MuiSelect-icon': {
				color: theme.palette.primary.main,
			},
		},
		formControl: {
			width: '100%',
		},
		container: {
			padding: 35,
		},
		topTitle: {
			boxShadow: '0px 2px 2px 0px grey',
			'& .MuiTab-root': {
				padding: 20,
				minWidth: 130,
			},
		},
		backContainer: {
			padding: 20,
			backgroundColor: theme.palette.grey.A100,
			boxSizing: 'border-box',
		},
		backIcon: {},
		backLink: {},
		bottomWrap: {
			display: 'flex',
			justifyContent: 'flex-end',
			paddingRight: 35,
			[theme.breakpoints.down('md')]: {
				overflow: 'hidden',
				display: 'block',
				padding: 0,
				'& button': {
					minWidth: '100%',
					borderRadius: 0,
					padding: '20px 20px',
				},
			},
		},
		title: {
			textTransform: 'uppercase',
			marginBottom: 5,
			fontSize: 13,
		},
		errorText: {
			textAlign: 'center',
			margin: '15px 0',
			color: 'red',
		},
		switch: {
			marginLeft: 15,
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
	})
);

function FormRoleComponent({ initialValues }: { initialValues?: Partial<BrandRoleInterface> }) {
	const classes = useStyles({});
	const roleService = new RoleService();

	const navigate = useNavigate();

	const { authBody } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const { roleId } = useParams();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);
	const [permissions, setPermissions] = useState<UserPermissionsInterface[]>([]);
	const [rolePermissions, setRolePermissions] = useState<UserPermissionsInterface[]>(initialValues?.permissions || []);

	const roleTypes = [BrandRoleType.ADMIN, BrandRoleType.MEMBER, BrandRoleType.VENUE_ADMIN];
	// if (isSuperAdmin(authBody)) {
	// 	roleTypes.push(BrandRoleType.SUPERADMIN);
	// }

	if (authBody.role.roleType === BrandRoleType.SUPERADMIN) {
		roleTypes.push(BrandRoleType.SUB_SUPERADMIN);
	}

	const loadPermissions = useCallback(
		async (roleType = BrandRoleType.MEMBER) => {
			let accessLevel = 'customer';
			if ([BrandRoleType.ADMIN, BrandRoleType.VENUE_ADMIN].includes(roleType)) accessLevel = 'admin';
			if (roleType === BrandRoleType.SUPERADMIN) accessLevel = 'superadmin';
			const [list] = await roleService.listPermissions({ accessLevel, limit: 50 });
			setPermissions(list);
		},
		[setPermissions]
	);

	const emptyRole = {
		name: '',
		roleType: BrandRoleType.MEMBER,
		brandId: isSuperAdmin(authBody) ? undefined : authBody?.brandId,
	};

	const {
		handleSubmit,
		control,
		getValues,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : emptyRole,
	});

	const roleType = watch('roleType');

	useEffect(() => {
		if (roleType === BrandRoleType.SUB_SUPERADMIN) {
			setValue('brandId', 9, { shouldValidate: true });
		}
		loadPermissions(roleType).then();
	}, [roleType]);

	const save = async (formData: BrandRoleInterface) => {
		try {
			setIsSaving(true);

			const cloneData = formData;
			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			cloneData.permissions = rolePermissions;

			if (!cloneData.brandId) delete cloneData.brandId;

			await roleService.save(cloneData, itemId);

			navigate('/dashboard/role');
			showSnackBar('Role saved!');
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		setIsSaving(true);
		setConfirmDialogVisible(false);
		try {
			if (typeof roleId !== 'undefined') {
				await roleService.delete(roleId);
				navigate('/dashboard/role');
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const getIsPermissionSelected = (permissionId: number | undefined) => {
		const found = rolePermissions.find((p) => Number(p.id) === Number(permissionId));
		return typeof found !== 'undefined';
	};

	const handlePermissionSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		const permissionId = Number(name.split('_').pop());
		const selectPermissionObj = permissions.find((p) => p.id === permissionId);

		if (checked) {
			if (typeof selectPermissionObj !== 'undefined') setRolePermissions([...rolePermissions, selectPermissionObj]);
		} else {
			const findIndex = rolePermissions.findIndex((p) => p.id === permissionId);
			const cloneArr = rolePermissions;
			cloneArr.splice(findIndex, 1);
			setRolePermissions([...cloneArr]);
		}
		// setChecked(event.target.checked);
	};

	return (
		<>
			<form onSubmit={handleSubmit((d) => save(d as BrandRoleInterface))} className={classes.root}>
				<Paper>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.backContainer}>
							<Button
								className={classes.backLink}
								onClick={() => navigate('/dashboard/role')}
								startIcon={<ChevronLeftIcon className={classes.backIcon} />}
							>
								<Typography>Back to role list</Typography>
							</Button>
						</Grid>
					</Grid>

					<Grid container spacing={3} className={classes.container}>
						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										InputLabelProps={{ shrink: true }}
										variant="outlined"
										helperText={errors.name ? errors.name.message : ''}
										label="Role Name"
										error={!!errors.name}
									/>
								)}
								rules={{ required: 'Field is required' }}
								name="name"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<AutocompleteAsync
										type="brand"
										label="Brand"
										{...field}
										filter={{}}
										error={errors.brandId}
										disabled={
											!isSuperAdmin(authBody) ||
											(initialValues && !initialValues.brandId) ||
											roleType === BrandRoleType.SUB_SUPERADMIN
										}
									/>
								)}
								name="brandId"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<SelectRoleTypeComponent control={control} filter={{ names: roleTypes }} />
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1" className={classes.label} style={{ padding: '25px 0' }}>
								Assign {capitalize(String(roleType))} Permissions
							</Typography>
							<Divider />

							<CustomScrollbar autoHide style={{ height: 400 }}>
								<List>
									{permissions.map((permission: UserPermissionsInterface) => (
										<ListItem key={permission.id} role={undefined} dense button>
											<ListItemIcon>
												<Checkbox
													edge="start"
													name={`permissionId_${String(permission.id)}`}
													checked={getIsPermissionSelected(permission.id)}
													tabIndex={-1}
													onChange={handlePermissionSelect}
													disableRipple
													inputProps={{ 'aria-labelledby': String(permission.id) }}
												/>
											</ListItemIcon>
											<ListItemText primary={permission.name} />
										</ListItem>
									))}
								</List>
							</CustomScrollbar>
							<Divider />
						</Grid>
					</Grid>

					{initialValues && initialValues.users && initialValues.users.length > 0 && (
						<Grid container spacing={3} style={{ paddingLeft: 20 }} className={classes.container}>
							<Grid item xs={12}>
								<h6>Users in this role</h6>
							</Grid>
							{initialValues.users.map((u) => (
								<Grid key={u.id} item xs={4} style={{ paddingTop: 0, paddingBottom: 0 }}>
									<Button component={Link} to={`/dashboard/community/members/${u.id}`}>
										{u.firstname}
										{u.lastname}
									</Button>
								</Grid>
							))}
						</Grid>
					)}
					{Object.keys(errors).length > 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Divider />
								<Typography className={classes.errorText}>You have errors in form. Please fill in all required fields.</Typography>
								<Divider />
							</Grid>
						</Grid>
					)}

					<Grid container spacing={3} className={classes.bottomWrap}>
						<Grid item xs={12} className={classes.bottomWrap}>
							<Button
								variant="contained"
								color="secondary"
								type="button"
								size="large"
								style={{ marginTop: 15, marginRight: 15 }}
								onClick={() => navigate('/dashboard/role')}
							>
								Cancel
							</Button>

							<Button variant="contained" color="primary" type="submit" size="large" style={{ marginTop: 15 }}>
								Save role
							</Button>
						</Grid>
					</Grid>

					<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Paper>
			</form>

			<ConfirmDialog
				text={`Are you sure you want to delete ${getValues('name')}?`}
				open={confirmDialogVisible}
				onClose={() => setConfirmDialogVisible(false)}
				action={handleDelete}
			/>
		</>
	);
}

export default memo(FormRoleComponent);
