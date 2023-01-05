import React, { memo, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MailIcon from '@mui/icons-material/Mail';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { AuthContext } from '@context/auth.context';
import SelectCompanyDialogComponent from '@shared-components/select-company-dialog.component';
import AvatarComponent from '@shared-components/avatar.component';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import UserService from '@service/user.service';
import { SnackBarContext } from '@context/snack-bar.context';
import UserFormValuesInterface from '@forms/interface/user-form-values.interface';
import UserCompanyComponent from '../../profile/user-company.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		avatar: {
			width: theme.spacing(13),
			height: theme.spacing(13),
		},
		middleSpacer: {
			margin: '30px 0',
			width: '100%',
		},
		fieldTitle: {
			fontWeight: 600,
			textTransform: 'uppercase',
			fontSize: 15,
			marginTop: 25,
		},
		myCompanyEdit: {
			marginLeft: 15,
			marginBottom: 2,
		},
		fieldValue: {
			fontSize: 15,
		},
		savingProgress: {
			position: 'absolute',
			width: '100%',
			top: 0,
			left: 0,
		},
	})
);

function CommunityMemberInfoComponent({ data, onSaved }: { data: UserInterface; onSaved: (user: UserInterface) => void }) {
	const { id } = useParams();

	const classes = useStyles({});
	const userService = new UserService();
	const { showSnackBar } = useContext(SnackBarContext);

	const { updateAuthData, authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);

	const [refreshCompanyList, setRefreshCompanyList] = useState<boolean>(false);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [editCompanyVisible, setEditCompanyVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [brandId, setBrandId] = useState<number | null>(data ? data.brandId : null);

	const methods = useForm();
	const { handleSubmit, control } = methods;

	const showControls = isSuperAdmin || isBrandAdmin || authBody?.id === data.id;

	const changeBrand = (changingBrandId: any) => {
		setBrandId(changingBrandId);
	};

	const onCompany = () => {
		setEditCompanyVisible(false);
		setRefreshCompanyList(!refreshCompanyList);
	};

	const onSubmit = async (userData: UserFormValuesInterface) => {
		try {
			const newData = userData;

			setIsSaving(true);

			if (brandId !== data.brandId) {
				newData.brandId = brandId;
			}

			if (data.email === newData.email) {
				delete newData.email;
			}
			const newUser = await userService.save(newData, id);
			onSaved(newUser as UserInterface);
			setIsSaving(false);
			setIsEditMode(false);
			if (authBody?.id === data.id) {
				updateAuthData();
			}
		} catch (e) {
			console.error(e);
			showSnackBar((e as Error).message);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', padding: 45, boxSizing: 'border-box' }}>
				{isSaving && <LinearProgress className={classes.savingProgress} />}
				<Grid container spacing={3}>
					<Grid item sm={2} xs={12}>
						<AvatarComponent
							size="lg"
							src={data.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${data.photo.url}` : undefined}
							altText={data.firstname}
						/>
					</Grid>
					<Grid item sm={6} xs={10} md={4}>
						<Typography className={classes.fieldTitle}>Name</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{`${data.firstname} ${data.lastname}`}</Typography>}
						{isEditMode && (
							<FormControl fullWidth style={{ display: 'inline-block' }}>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isSaving} style={{ width: '45%', marginRight: '5%' }} />}
									name="firstname"
									control={control}
									defaultValue={data.firstname}
								/>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isSaving} style={{ width: '45%' }} />}
									name="lastname"
									control={control}
									defaultValue={data.lastname}
								/>
							</FormControl>
						)}
					</Grid>
					<Grid item sm={3} xs={6} md={4}>
						{!isEditMode && (
							<Button variant="contained" color="primary" style={{ marginRight: 15 }} startIcon={<MailIcon />}>
								MESSAGE
							</Button>
						)}
						{!isEditMode && showControls && (
							<Button variant="contained" color="primary" onClick={() => setIsEditMode(true)} startIcon={<EditIcon />}>
								EDIT
							</Button>
						)}

						{isEditMode && (
							<Button variant="contained" color="primary" type="submit" style={{ marginRight: 15 }} startIcon={<DoneIcon />}>
								DONE
							</Button>
						)}
						{isEditMode && (
							<Button variant="contained" color="secondary" onClick={() => setIsEditMode(false)} startIcon={<ClearIcon />}>
								CANCEL
							</Button>
						)}
					</Grid>
				</Grid>

				<Divider variant="middle" className={classes.middleSpacer} />

				<Grid container spacing={3}>
					<Grid item sm={4} xs={12}>
						<Typography className={classes.fieldTitle}>
							Company
							{showControls && (
								<Button
									color="primary"
									className={classes.myCompanyEdit}
									onClick={() => setEditCompanyVisible(true)}
									variant="contained"
								>
									Edit
								</Button>
							)}
						</Typography>
						<UserCompanyComponent refresh={refreshCompanyList} />
					</Grid>

					<Grid item sm={4} xs={12}>
						<Typography className={classes.fieldTitle}>Brand</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.brand?.name}</Typography>}
						{isEditMode && (
							<AutocompleteAsync
								type="brand"
								label="Brand"
								variant="standard"
								disabled={!isSuperAdmin}
								defaultValue={Number(brandId)}
								onChange={changeBrand}
							/>
						)}
					</Grid>

					<Grid item sm={4} xs={12}>
						<Typography className={classes.fieldTitle}>Email</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.email}</Typography>}
						{isEditMode && (
							<FormControl fullWidth>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isSaving} />}
									name="email"
									control={control}
									defaultValue={data.email || ''}
								/>
							</FormControl>
						)}
					</Grid>

					<Divider variant="middle" className={classes.middleSpacer} />

					<Grid item sm={8} xs={12}>
						<Typography className={classes.fieldTitle}>About</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.about}</Typography>}
						{isEditMode && (
							<FormControl fullWidth>
								<Controller
									render={({ field }) => <TextField {...field} multiline disabled={isSaving} />}
									name="about"
									control={control}
									defaultValue={data.about || ''}
								/>
							</FormControl>
						)}
					</Grid>
				</Grid>
			</form>

			<SelectCompanyDialogComponent
				userId={Number(id)}
				open={editCompanyVisible}
				onClose={onCompany}
				onCancel={() => setEditCompanyVisible(false)}
			/>
		</>
	);
}

export default memo(CommunityMemberInfoComponent);
