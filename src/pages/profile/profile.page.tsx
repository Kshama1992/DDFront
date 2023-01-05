import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormHelperText, Theme, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserInterface from 'dd-common-blocks/lib/interface/user.interface';
import SelectCompanyDialogComponent from '@shared-components/select-company-dialog.component';
import { AuthContext } from '@context/auth.context';
import UserService from '@service/user.service';
import { SnackBarContext } from '@context/snack-bar.context';
import ImageEditor from '@shared-components/image-editor.component';
import UploadFileHelper from '@helpers/file-upload.helper';
import FormChangePassComponent from '@forms/form-change-pass.component';
import PhoneInputComponent from '@forms/elements/phone-input.component';
import AuthService from '@service/auth.service';
import checkPermsHelper from '@helpers/checkPerms.helper';
import UserCompanyComponent from './user-company.component';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import BasePage from '../base.page';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: 'calc(100% - 70px)',
			margin: 0,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
				// padding: '17px 14px 17px 58px'
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		root: {
			width: 'calc(100% - 90px)',
			height: 'calc(100% - 70px)',
			margin: 0,
			marginLeft: 90,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
				// padding: '17px 14px 17px 58px'
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		profileTop: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
		avatar: {
			width: theme.spacing(13),
			height: theme.spacing(13),
			cursor: 'pointer',
		},
		profileInner: {
			position: 'relative',
			minHeight: 400,
			padding: '30px 60px 40px',
			[theme.breakpoints.down('md')]: {
				padding: '30px 15px 40px',
				'& .react-tel-input .form-control': {
					width: '100%',
				},
			},
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
		myCompanyTitle: {
			fontWeight: 600,
			textTransform: 'uppercase',
			fontSize: 15,
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
		uploadInput: {
			display: 'none',
		},
		gridWrap: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				paddingRight: 24,
			},
		},
		phoneInput: {
			border: 'none',
			'& .form-control': {
				border: 'none',
				borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
				paddingBottom: 10,
				paddingTop: 10,
				marginTop: 10,
				color: 'currentColor',
				borderRadius: '0 !important',
				outline: 'none',
				'&:focus': {
					borderBottom: '2px solid #2196f3',
					boxShadow: 'none',
				},
			},
		},
	})
);

export default function ProfilePage() {
	const theme = useTheme();
	const classes = useStyles({});

	const { id } = useParams();
	const navigate = useNavigate();
	const {
		handleSubmit,
		control,
		reset,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();
	const userService = new UserService();
	const authService = new AuthService();

	const { updateAuthData, authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const isOwner = String(authBody?.id) === id;
	const [isPhoneValid, setIsPhoneValid] = useState(true);
	const [refreshCompanyList, setRefreshCompanyList] = useState<boolean>(false);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [editCompanyVisible, setEditCompanyVisible] = useState<boolean>(false);
	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [data, setData] = useState<UserInterface>();

	const [image, setImage] = useState<string>('');
	const [uploadImage, setUploadImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);

	const [changePassVisible, setChangePassVisible] = useState<boolean>(false);

	if (authBody && Number(authBody.id) !== Number(id)) navigate(`/profile/${authBody.id}`);
	if (!checkPermsHelper(['Customer Profile'], [], authBody)) navigate(getFirstMenuItem(authBody).url);

	const handlePhoneValidation = async (phone: any | null) => {
		if (!phone) return false;
		if (!isPhoneValid) return 'Phone number is invalid';
		const params: any = { phone };
		if (id !== '0') {
			params.userId = Number(id);
		}
		const { valid: isValid } = await authService.validatePhone(params);
		return !isValid ? 'Phone number is already taken' : true;
	};

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const profile = await userService.single(id);

			if (profile) {
				setData(profile);
				reset(profile);
				setImage(profile.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${profile.photo.url}` : '');
			}
		} catch (e) {
			console.error(e);
			navigate('/');
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadData().then();
	}, []);

	const onSubmit = async (userData: any) => {
		try {
			const newData = userData;

			setIsLoading(true);

			if (data && data.email === newData.email) {
				delete newData.email;
			}

			newData.phone = Number(newData.phone);
			newData.securityDeposit = Number(newData.securityDeposit);
			newData.securityDepositToRevenue = Number(newData.securityDepositToRevenue);

			if (uploadImage) {
				newData.uploadAttachments = [uploadImage];
			}

			const savedUser = await userService.updateProfile(newData, String(id));
			setData(savedUser);
			setIsEditMode(false);
			if (data && authBody?.id === data.id) {
				updateAuthData();
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsLoading(false);
		}
	};

	const onCompanySelectClose = () => {
		setEditCompanyVisible(false);
		setRefreshCompanyList(!refreshCompanyList);
	};

	const handleImageSave = (base64: string) => {
		setImage(base64);
		setImageEditVisible(false);
	};

	const onUploadFile = async (event: any) => {
		const base64: string = await UploadFileHelper(event);
		setUploadImage(base64);
		setImageEditVisible(true);
	};

	const renderProfile = () => {
		if (!data) return <></>;
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				{isLoading && <LinearProgress className={classes.savingProgress} />}
				<Grid container spacing={3}>
					<Grid item sm={3} xs={12}>
						{!isEditMode && <Avatar alt={`${data.firstname} ${data.lastname}`} src={image} className={classes.avatar} />}
						{isEditMode && (
							<>
								<input
									accept="image/*"
									name="uploadAttachments[]"
									className={classes.uploadInput}
									id="contained-button-file"
									type="file"
									onChange={onUploadFile}
								/>
								<label htmlFor="contained-button-file">
									<Avatar alt={`${data.firstname} ${data.lastname}`} src={image} className={classes.avatar} />
								</label>
							</>
						)}
					</Grid>
					<Grid item sm={7} xs={12}>
						<Typography className={classes.fieldTitle}>Name</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{`${data.firstname} ${data.lastname}`}</Typography>}
						{isEditMode && (
							<FormControl fullWidth style={{ display: 'inline-block' }}>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isLoading} style={{ width: '45%', marginRight: '5%' }} />}
									name="firstname"
									control={control}
									defaultValue={data.firstname}
								/>
								<Controller
									render={({ field }) => <TextField {...field} style={{ width: '45%' }} disabled={isLoading} />}
									name="lastname"
									control={control}
									defaultValue={data.lastname}
								/>
							</FormControl>
						)}
					</Grid>
					<Grid item sm={2} xs={12}>
						{!isEditMode && (
							<Button
								variant="contained"
								style={{ marginTop: 15 }}
								color="primary"
								onClick={() => setIsEditMode(true)}
								startIcon={<EditIcon />}
							>
								EDIT
							</Button>
						)}

						{isEditMode && (
							<>
								<Button
									variant="contained"
									disabled={isLoading}
									color="primary"
									type="submit"
									style={{ marginRight: 15, marginTop: 15, marginBottom: 15 }}
									startIcon={<DoneIcon />}
								>
									DONE
								</Button>
								<br />
								<Button variant="contained" color="secondary" onClick={() => setIsEditMode(false)} startIcon={<ClearIcon />}>
									CANCEL
								</Button>
							</>
						)}
					</Grid>
				</Grid>

				<Divider variant="middle" className={classes.middleSpacer} />

				<Grid container spacing={3}>
					{(isBrandAdmin || isSuperAdmin || isOwner) && (
						<>
							<Grid item sm={4} xs={12}>
								<Typography className={classes.fieldTitle}>Email</Typography>
								{!isEditMode && <Typography className={classes.fieldValue}>{data.email}</Typography>}
								{isEditMode && (
									<FormControl fullWidth>
										<Controller
											render={({ field }) => <TextField {...field} disabled={isLoading} />}
											name="email"
											control={control}
											defaultValue={data.email || ''}
										/>
									</FormControl>
								)}
							</Grid>

							<Grid item sm={8} xs={12}>
								<Typography className={classes.fieldTitle} style={{ marginBottom: 17 }}>
									Phone
								</Typography>
								{!isEditMode && <Typography className={classes.fieldValue}>{data.phone}</Typography>}
								{isEditMode && (
									<FormControl fullWidth>
										<Controller
											render={({ field }) => (
												<PhoneInputComponent
													{...field}
													disabled={isLoading}
													onValidate={(isValid) => {
														if (isValid && errors.phone) clearErrors('phone');
														if (!isValid && !errors.phone)
															setError(
																'phone',
																{ type: 'isPhoneValid', message: 'Phone number is not valid' },
																{ shouldFocus: true }
															);
														setIsPhoneValid(isValid);
													}}
												/>
											)}
											rules={{
												required: 'Field is required',
												validate: handlePhoneValidation,
											}}
											control={control}
											name="phone"
										/>
										{errors.phone && (
											<FormHelperText style={{ paddingLeft: 15 }} error>
												{/* @ts-ignore */}
												{errors.phone.message}
											</FormHelperText>
										)}
									</FormControl>
								)}
							</Grid>

							<Divider variant="middle" className={classes.middleSpacer} />
						</>
					)}

					{checkPermsHelper(['Enable Company Tab'], [], authBody) && (
						<Grid item sm={12} xs={12}>
							<Typography className={classes.myCompanyTitle}>
								My companies{' '}
								<Button
									color="primary"
									className={classes.myCompanyEdit}
									onClick={() => setEditCompanyVisible(true)}
									variant="contained"
								>
									Edit
								</Button>
							</Typography>
							<UserCompanyComponent refresh={refreshCompanyList} />
						</Grid>
					)}

					<Divider variant="middle" className={classes.middleSpacer} />

					{String(authBody?.id) === id && (
						<>
							<Grid item sm={4} xs={12}>
								<Button variant="contained" color="primary" size="medium" onClick={() => setChangePassVisible(true)}>
									Change Password
								</Button>
							</Grid>

							<Divider variant="middle" className={classes.middleSpacer} />
						</>
					)}

					<Grid item sm={8} xs={12}>
						<Typography className={classes.fieldTitle}>About</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.about}</Typography>}
						{isEditMode && (
							<FormControl fullWidth>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isLoading} multiline />}
									name="about"
									control={control}
									defaultValue={data.about || ''}
								/>
							</FormControl>
						)}
					</Grid>
				</Grid>
			</form>
		);
	};

	return (
		<BasePage>
			<Helmet>
				<title>Profile {data ? `${data.firstname} ${data.lastname}` : ''}</title>
				<meta name="description" content="Profile" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} className={classes.profileTop}>
					<BreadcrumbsComponent primary="Account Settings:" secondary="Profile" />
				</Grid>
				<Grid item sm={6} xs={12} className={classes.gridWrap}>
					<Paper className={classes.profileInner}>{data && renderProfile()}</Paper>

					<br />
					<Button component="a" href="https://drop-desk.com/termsandconditions" target="_blank">
						User Terms OF Use
					</Button>
					<Button component="a" href="https://drop-desk.com/privacypolicy" target="_blank">
						Privacy Policy
					</Button>
					<Button component="a" href="https://drop-desk.com/enterprise-terms" target="_blank">
						Enterprise Terms Of Use
					</Button>
				</Grid>
			</Grid>

			<SelectCompanyDialogComponent
				userId={Number(id)}
				open={editCompanyVisible}
				onClose={onCompanySelectClose}
				onCancel={onCompanySelectClose}
			/>

			<Dialog onClose={() => setImageEditVisible(false)} aria-labelledby="simple-dialog-title" open={imageEditVisible}>
				<ImageEditor aspectRatio={1} image={uploadImage} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>

			<Dialog open={changePassVisible} onClose={() => setChangePassVisible(false)} maxWidth="sm" fullWidth>
				<FormChangePassComponent userId={String(id)} onSave={() => setChangePassVisible(false)} />
			</Dialog>
		</BasePage>
	);
}
