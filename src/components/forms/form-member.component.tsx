import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Sticky, StickyContainer } from 'react-sticky';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Button from '@mui/material/Button';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import PauseIcon from '@mui/icons-material/Pause';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Tabs from '@mui/material/Tabs';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Paper from '@mui/material/Paper';
import MailIcon from '@mui/icons-material/Mail';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import StarIcon from '@mui/icons-material/Star';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as EmailValidator from 'email-validator';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import BrandRoleType from 'dd-common-blocks/dist/type/BrandRoleType';
import CCInterface from 'dd-common-blocks/dist/interface/cc.interface';
import UserStatus from 'dd-common-blocks/dist/type/UserStatus';
import SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import { AuthContext } from '@context/auth.context';
import ImageEditor from '@shared-components/image-editor.component';
import { SnackBarContext } from '@context/snack-bar.context';
import AvatarComponent from '@shared-components/avatar.component';
import CCAvatar from '@pages/payment-methods/cc-avatar.component';
import UserCompanyComponent from '@pages/profile/user-company.component';
import AddCCComponent from '@pages/payment-methods/add-cc.component';
import SelectCompanyDialogComponent from '@shared-components/select-company-dialog.component';
import checkPermsHelper from '@helpers/checkPerms.helper';
import SelectRoleComponent from '@forms/elements/select-role.component';
import FormChangePassComponent from '@forms/form-change-pass.component';
import SpaceTypeService from '@service/space-type.service';
import UserService from '@service/user.service';
import RoleService from '@service/role.service';
import AuthService from '@service/auth.service';
import ConfirmDialog from '@shared-components/confirm.dialog';
import FormMemberStyles from '@forms/styles/form-member.styles';
import VenueChipsBlock from '@forms/blocks/venue-chips';
import AnchorLinkComponent from '@shared-components/anchor-link.component';
import UserFormValuesInterface from '@forms/interface/user-form-values.interface';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@core/config';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { Waypoint } from 'react-waypoint';
import UserFilterInterface from 'dd-common-blocks/dist/interface/filter/user-filter.interface';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import PhoneInputComponent from '@forms/elements/phone-input.component';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';
import UserSubscriptionsTableComponent from '@forms/elements/user-subscriptions-table.component';
import SubFormValues from '@forms/interface/sub-form.interface';
import FormSubscriptionComponent from '@forms/form-subscription.component';
import SubscriptionService from '@service/subscription.service';

function FormMemberComponent({ initialValues, doRefresh }: { initialValues?: UserFormValuesInterface; brandId?: number; doRefresh: () => any }) {
	const classes = FormMemberStyles({});
	const navigate = useNavigate();
	const spaceTypeService = new SpaceTypeService();
	const userService = new UserService();
	const roleService = new RoleService();
	const authService = new AuthService();
	const subscriptionService = new SubscriptionService();

	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const isOwner = authBody?.id === initialValues?.id;

	const { id: userId } = useParams();

	const [isEditMode, setIsEditMode] = useState<boolean>(isSuperAdmin || isBrandAdmin);

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [confirmDeleteDialogVisible, setConfirmDeleteDialogVisible] = useState<boolean>(false);
	const [confirmMoveOutDialogVisible, setConfirmMoveOutDialogVisible] = useState<boolean>(false);
	const [confirmSuspendDialogVisible, setConfirmSuspendDialogVisible] = useState<boolean>(false);
	const [confirmMakeUnMakeDialogVisible, setConfirmMakeUnMakeDialogVisible] = useState<boolean>(false);

	const [changePassVisible, setChangePassVisible] = useState<boolean>(false);
	const [selectTeamVisible, setSelectTeamVisible] = useState<boolean>(false);

	const [isSubSaving, setIsSubSaving] = useState<boolean>(false);
	const [editingSub, setEditingSub] = useState<SubFormValues | undefined>();
	const [subscriptionVisible, setSubscriptionVisible] = useState<boolean>(false);

	const showControls = isSuperAdmin || isBrandAdmin || (initialValues && authBody && authBody.id === initialValues.id);
	const [refreshCompanyList, setRefreshCompanyList] = useState<boolean>(false);
	const [editCompanyVisible, setEditCompanyVisible] = useState<boolean>(false);

	const [activeTab, setActiveTab] = useState<string>('info');
	const [spaceTypeList, setSpaceTypeList] = useState<SpaceTypeInterface[]>([]);

	const [uploadAttachments, setUploadAttachments] = useState<string[]>([]);
	const [isPhoneValid, setIsPhoneValid] = useState(true);

	const [photoPreview, setPhotoPreview] = useState<string>('');
	const [photoPreviewVisible, setPhotoPreviewVisible] = useState<boolean>(false);
	const [editingImage, setEditingImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);

	const [addCardVisible, setAddCardVisible] = useState<boolean>(false);
	const [editingCard, setEditingCard] = useState<CCInterface | undefined>();
	const [deletingCard, setDeletingCard] = useState<CCInterface | undefined>();

	const [rolesList, setRolesList] = useState<BrandRoleInterface[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>('');
	const [currentRole, setCurrentRole] = useState<BrandRoleInterface | undefined>();

	const [adminVenues, setAdminVenues] = useState<VenueInterface[] | undefined>(initialValues?.adminVenues);
	const [venueAdminError, setVenueAdminError] = useState(false);

	const [userCC, setUserCC] = useState<CCInterface[]>([]);

	const tabList = ['info', 'billing', 'team'];

	if (userId && userId !== '0') tabList.push('membership');

	const allowedRoleTypes = [BrandRoleType.ADMIN, BrandRoleType.VENUE_ADMIN, BrandRoleType.MEMBER];
	if (authBody.role.roleType === BrandRoleType.SUPERADMIN) allowedRoleTypes.push(BrandRoleType.SUB_SUPERADMIN);

	const defaultFormData: UserFormValuesInterface = {
		firstname: '',
		lastname: '',
		username: '',
		about: '',
		password: '',
		firstPass: '',
		phone: '',
		email: '',
		userId: '',
		roleId: '',
		brandId: isSuperAdmin ? undefined : Number(authBody?.brandId),
		subscriptions: [],
	};

	const {
		handleSubmit,
		control,
		getValues,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : defaultFormData,
	});

	const { fields: userSubs } = useFieldArray({
		control,
		name: 'subscriptions',
	});

	const brandId = watch('brandId');
	const roleId = watch('roleId');
	const firstPass = watch('firstPass');

	const handleHttpError = (e: any) => {
		let errorMsg = e.message;

		if (e.data && e.data.length) {
			e.data.forEach(({ msg, param }: { msg: string; param: string }) => {
				errorMsg += `. ${msg}: ${param}`;
			});
		}
		showSnackBar(errorMsg);
	};

	const loadUserCards = useCallback(async () => {
		if (userId === '0') return;
		try {
			const cardsArr = await userService.getCards(userId);
			setUserCC(cardsArr);
		} catch (e) {
			const error = e as Error;
			showSnackBar(error.message);
		}
	}, [userId]);

	const loadRoles = useCallback(async () => {
		try {
			const [rl] = await roleService.list({ brandId });
			setRolesList(rl);
		} catch (e) {
			const error = e as Error;
			showSnackBar(error.message);
		}
	}, [userId, brandId]);

	const loadSpaceTypes = useCallback(async () => {
		const [spaceTypes] = await spaceTypeService.list({ onlyChildren: true });
		setSpaceTypeList(spaceTypes);
	}, [spaceTypeList]);

	useEffect(() => {
		loadUserCards().then();
		loadSpaceTypes().then();
		loadRoles().then();

		if (
			isSuperAdmin ||
			(authBody && initialValues && authBody.id === initialValues.id) ||
			(initialValues && authBody && authBody.brandId === initialValues.brandId && isBrandAdmin)
		) {
			setIsEditMode(true);
		}

		if (initialValues && initialValues.subscriptions) {
			// eslint-disable-next-line no-param-reassign
			initialValues.subscriptions = initialValues.subscriptions.filter(
				(s) => ![SubscriptionStatus.DELETED, SubscriptionStatus.CANCELED].includes(s.status)
			);

			(initialValues.subscriptions as SubscriptionInterface[]).sort((a, b) => {
				const aDate = new Date(a.createdAt);
				const bDate = new Date(b.createdAt);
				if (aDate > bDate) return -1;
				return aDate < bDate ? 1 : 0;
			});
		}

		if (initialValues && !initialValues.phone) {
			initialValues.phone = '';
		}
	}, []);

	useEffect(() => {
		setCurrentRole(undefined);
		loadRoles().then();
	}, [brandId]);

	useEffect(() => {
		if (roleId && rolesList) setCurrentRole(rolesList.find((r) => Number(r.id) === Number(roleId)));
	}, [roleId, rolesList]);

	const handleSuspend = async () => {
		setIsSaving(true);
		try {
			if (typeof userId !== 'undefined') {
				await userService.suspend(userId);
				if (doRefresh) doRefresh();
				showSnackBar('Done');
			}
		} catch (e) {
			handleHttpError(e);
		} finally {
			setIsSaving(false);
			setConfirmSuspendDialogVisible(false);
		}
	};

	const handleDelete = async () => {
		setIsSaving(true);
		try {
			if (typeof userId !== 'undefined') {
				await userService.delete(userId);
				showSnackBar('Done');
				navigate('/dashboard/community/members');
			}
		} catch (e) {
			handleHttpError(e);
		} finally {
			setIsSaving(false);
			setConfirmDeleteDialogVisible(false);
		}
	};

	const handleMoveout = async () => {
		setIsSaving(true);
		try {
			if (typeof userId !== 'undefined') {
				await userService.moveOut(userId);
				if (doRefresh) doRefresh();
				showSnackBar('Done');
			}
		} catch (e) {
			handleHttpError(e);
		} finally {
			setIsSaving(false);
			setConfirmMoveOutDialogVisible(false);
		}
	};

	const onAddCard = async () => {
		try {
			await loadUserCards();
			setEditingCard(undefined);
			setAddCardVisible(false);
		} catch (e) {
			const error = e as Error;
			showSnackBar(error.message);
		}
	};

	const onAddCardClose = () => {
		setAddCardVisible(false);
		setEditingCard(undefined);
	};

	const onAddCardShow = () => {
		setAddCardVisible(true);
	};

	const handleEditCard = (cc: CCInterface) => {
		setEditingCard(cc);
		setAddCardVisible(true);
	};

	const handleSetDefault = async (cardId: string) => {
		try {
			await userService.setDefaultCard(userId, cardId);
			await loadUserCards();
		} catch (e) {
			const error = e as Error;
			showSnackBar(error.message);
		}
	};

	const closeDialog = () => {
		setDeletingCard(undefined);
	};

	const onDeleteRequest = async (cc: CCInterface) => {
		setDeletingCard(cc);
	};

	const handleDeleteCard = async () => {
		try {
			if (deletingCard) await userService.deleteCard(userId, String(deletingCard.id));
			closeDialog();
			await loadUserCards();
		} catch (e) {
			const error = e as Error;
			showSnackBar(error.message);
		}
	};

	const onCompanySelectClose = () => {
		setEditCompanyVisible(false);
		setRefreshCompanyList(!refreshCompanyList);
	};

	const changeTab = (event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};

	const renderTeamName = () => {
		if (initialValues && initialValues.teamMembership && initialValues.teamMembership.length > 0)
			return (
				<Typography className={classes.text}>
					User is member of {initialValues.teamMembership.map((t) => `"${t.team?.name}"`).toString()} team
				</Typography>
			);

		if (initialValues && initialValues.leadingTeams && initialValues.leadingTeams.length > 0)
			return <Typography className={classes.text}>User is leading {initialValues.leadingTeams.map((t) => t.name).toString()} team</Typography>;

		return <Typography className={classes.text}>User has no team.</Typography>;
	};

	const handleImageSave = (base64Image: string) => {
		setUploadAttachments([...uploadAttachments, base64Image]);
		setEditingImage('');
		setImageEditVisible(false);
	};

	const handleClosePhotoPreview = () => {
		setPhotoPreview('');
		setPhotoPreviewVisible(false);
	};

	const handlePhoneValidation = async (phone: any | null) => {
		if (!phone) return false;
		if (!isPhoneValid) return 'Phone number is invalid';
		const params: any = { phone };
		if (userId !== '0') {
			params.userId = Number(userId);
		}
		const { valid: isValid } = await authService.validatePhone(params);
		return !isValid ? 'Phone number is already taken' : true;
	};

	const handleEmailValidation = async (email: any) => {
		const isValidSyntax = EmailValidator.validate(email);
		if (!isValidSyntax) return 'Email format is wrong';

		const params: any = { email };
		if (userId !== '0') {
			params.userId = Number(userId);
		}

		const { valid: isValid } = await authService.validateEmail(params);
		return !isValid ? 'Email is already taken' : true;
	};

	const handleSubEdit = async (editSub: SubFormValues) => {
		const thisSub = await subscriptionService.single(editSub.id);
		// @ts-ignore
		setEditingSub(thisSub);
		setSubscriptionVisible(true);
	};

	const handleSubscriptionSave = async (sub: SubFormValues) => {
		try {
			setIsSubSaving(true);
			setEditingSub(undefined);
			setSubscriptionVisible(false);
			// @ts-ignore
			if (typeof sub.id === 'undefined' || sub.id === 0) {
				await subscriptionService.save(sub);
			} else {
				await subscriptionService.save(sub, sub.id);
			}
			doRefresh();
		} catch (e) {
			const error = e as Error;
			showSnackBar(error.message);
		} finally {
			setIsSubSaving(false);
		}
	};

	const handleUsernameValidation = async (username: any) => {
		const params: any = { username };
		if (userId !== '0') {
			params.userId = Number(userId);
		}

		const { valid: isValid } = await authService.validateUsername(params);
		return !isValid ? 'Username already taken.' : true;
	};

	const save = async (formData: UserFormValuesInterface) => {
		try {
			setIsSaving(true);

			const cloneData = formData;
			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			// @ts-ignore
			delete cloneData.subscriptions;

			if (currentRole && currentRole.roleType === BrandRoleType.VENUE_ADMIN) {
				setVenueAdminError(false);

				if (!adminVenues || !adminVenues.length) {
					setVenueAdminError(true);
					showSnackBar('Venue admin must have at least 1 venue to admin!');
					return;
				}
				cloneData.adminVenues = adminVenues;
			}

			const savedUser = (await userService.save(cloneData, itemId)) as UserInterface;

			if (!itemId) {
				navigate(`/dashboard/community/members/${savedUser.id}`);
				window.location.reload();
			}

			showSnackBar('User saved!');
			doRefresh();
		} catch (e) {
			handleHttpError(e);
		} finally {
			setIsSaving(false);
		}
	};

	const handleMakeUnMakeAdminFromDialog = async () => {
		if (typeof selectedRole === 'undefined') {
			showSnackBar('Please select role first');
			return;
		}
		const itemId = initialValues && initialValues.id ? initialValues.id : null;
		await userService.save({ roleId: Number(selectedRole) }, itemId);
		doRefresh();
	};

	const handleMakeUnMakeAdmin = async () => {
		try {
			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			const [r] = await roleService.list({
				brandId: initialValues?.brandId,
				limit: 50,
				type: !initialValues?.isAdmin ? BrandRoleType.ADMIN : BrandRoleType.MEMBER,
			});

			if (r.length === 1) {
				await userService.save({ roleId: r[0].id }, itemId);
				doRefresh();
			} else {
				setRolesList(r);
				setConfirmMakeUnMakeDialogVisible(true);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleChangeRole = (event: SelectChangeEvent) => {
		setSelectedRole(event.target.value as string);
	};

	const createStickyStyles = (style: any) => ({ ...style, top: 70, backgroundColor: 'white', zIndex: 1 });

	return (
		<>
			<form onSubmit={handleSubmit(save)} className={classes.root}>
				<Paper style={{ marginBottom: 15, paddingBottom: 15 }}>
					<StickyContainer>
						<Sticky>
							{({ style }) => (
								<Grid container spacing={0} style={createStickyStyles(style)}>
									<Grid item xs={12} className={classes.topTitle}>
										{(isSuperAdmin || isBrandAdmin) && (
											<StickyContainer>
												<Tabs value={activeTab} indicatorColor="primary" textColor="primary" onChange={changeTab}>
													{tabList.map((tabName: string, index: number) => (
														<Tab
															key={index}
															label={tabName === 'info' ? 'Profile' : tabName}
															value={tabName}
															offset="200"
															href={`#${tabName}`}
															component={AnchorLinkComponent}
														/>
													))}
													{initialValues && checkPermsHelper([''], ['Billings'], authBody) && (
														<Tab
															label="Invoices"
															onClick={() => navigate(`/dashboard/community/members/${userId}/invoices/past`)}
															value="invoices"
														/>
													)}
												</Tabs>
											</StickyContainer>
										)}
									</Grid>
								</Grid>
							)}
						</Sticky>

						<Grid container spacing={0}>
							<Grid item xs={12} className={classes.backContainer}>
								<Button
									className={classes.backLink}
									onClick={() => navigate(`${isSuperAdmin || isBrandAdmin ? '/dashboard' : ''}/community/members`)}
									startIcon={<ChevronLeftIcon className={classes.backIcon} />}
								>
									<Typography>Back to members list</Typography>
								</Button>
							</Grid>
						</Grid>

						<Waypoint onEnter={() => setActiveTab('info')} />
						<Typography id="info" className={classes.tabTitleWrapper}>
							Basic Information
						</Typography>

						<Grid container spacing={3} className={classes.container}>
							<Grid item lg={2} md={3} xs={12}>
								<AvatarComponent
									size="lg"
									src={
										initialValues && initialValues.photo
											? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${initialValues.photo.url}`
											: undefined
									}
									altText={initialValues ? initialValues.firstname : ''}
								/>
							</Grid>
							<Grid item lg={6} xs={12} md={4}>
								<Typography className={classes.fieldTitle}>Name</Typography>
								{!isEditMode && (
									<Typography className={classes.fieldValue}>{`${initialValues ? initialValues.firstname : ''} ${
										initialValues ? initialValues.lastname : ''
									}`}</Typography>
								)}
								{isEditMode && (
									<FormControl fullWidth style={{ display: 'inline-block' }}>
										<Controller
											render={({ field }) => (
												<TextField
													{...field}
													disabled={isSaving}
													variant="outlined"
													error={!!errors.firstname}
													helperText={errors.firstname ? errors.firstname.message : ''}
													style={{ width: '45%', marginRight: '5%' }}
												/>
											)}
											name="firstname"
											rules={{ required: 'Field is required' }}
											control={control}
										/>
										<Controller
											render={({ field }) => (
												<TextField
													{...field}
													disabled={isSaving}
													error={!!errors.lastname}
													helperText={errors.lastname ? errors.lastname.message : ''}
													variant="outlined"
													style={{ width: '45%' }}
												/>
											)}
											name="lastname"
											control={control}
											rules={{ required: 'Field is required' }}
										/>
									</FormControl>
								)}
							</Grid>
							<Grid item sm={3} xs={6} md={4}>
								{checkPermsHelper(['Customer Messages'], [], authBody) && (
									<Button variant="contained" color="primary" style={{ marginRight: 15 }} startIcon={<MailIcon />}>
										MESSAGE
									</Button>
								)}
							</Grid>
						</Grid>

						<Divider variant="middle" className={classes.middleSpacer} />
						{!initialValues && (
							<>
								<Grid container spacing={3} className={classes.container}>
									<Grid item sm={4} xs={12}>
										<Typography className={classes.fieldTitle}>Password</Typography>
										<FormControl fullWidth>
											<Controller
												render={({ field }) => (
													<TextField
														{...field}
														type="password"
														variant="outlined"
														disabled={isSaving}
														error={!!errors.firstPass}
														helperText={errors.firstPass ? errors.firstPass.message : ''}
														style={{ marginTop: 0 }}
													/>
												)}
												name="firstPass"
												control={control}
												defaultValue=""
												rules={{
													required: 'Field is required',
													minLength: { value: PASSWORD_MIN_LENGTH, message: `Min password length ${PASSWORD_MIN_LENGTH}` },
													maxLength: { value: PASSWORD_MAX_LENGTH, message: `Max password length ${PASSWORD_MAX_LENGTH}` },
												}}
											/>
										</FormControl>
									</Grid>
									<Grid item sm={4} xs={12}>
										<Typography className={classes.fieldTitle}>Repeat Password</Typography>
										<FormControl fullWidth>
											<Controller
												render={({ field }) => (
													<TextField
														{...field}
														type="password"
														variant="outlined"
														disabled={isSaving}
														error={!!errors.password}
														style={{ marginTop: 0 }}
														helperText={errors.password ? errors.password.message : ''}
													/>
												)}
												rules={{
													validate: (value: string | undefined) =>
														value && value === firstPass ? true : 'Passwords must be equal',
													required: 'Field is required',
												}}
												name="password"
												control={control}
											/>
										</FormControl>
									</Grid>
								</Grid>
								<Divider variant="middle" className={classes.middleSpacer} />
							</>
						)}

						{initialValues && (isBrandAdmin || isSuperAdmin || (authBody && initialValues.id === authBody.id)) && (
							<>
								<Grid container spacing={3} className={classes.container}>
									<Grid item sm={4} xs={12}>
										<Button variant="contained" color="primary" size="medium" onClick={() => setChangePassVisible(true)}>
											Change Password
										</Button>
									</Grid>
								</Grid>
								<Divider variant="middle" className={classes.middleSpacer} />
							</>
						)}

						<Grid container spacing={3} className={classes.container}>
							{(isBrandAdmin || isSuperAdmin) && (
								<Grid item sm={4} xs={12}>
									<Typography className={classes.fieldTitle}>Username</Typography>
									{!isEditMode && (
										<Typography className={classes.fieldValue}>{initialValues ? initialValues.username : ''}</Typography>
									)}
									{isEditMode && (
										<FormControl fullWidth>
											<Controller
												render={({ field }) => (
													<TextField
														{...field}
														variant="outlined"
														disabled={isSaving}
														error={!!errors.username}
														helperText={errors.username ? errors.username.message : ''}
														style={{ marginTop: 0 }}
													/>
												)}
												name="username"
												rules={{ validate: handleUsernameValidation, required: 'Field is required' }}
												control={control}
											/>
										</FormControl>
									)}
								</Grid>
							)}

							{(isBrandAdmin || isSuperAdmin || isOwner) && (
								<Grid item sm={4} xs={12}>
									<Typography className={classes.fieldTitle}>Phone</Typography>
									{!isEditMode && (
										<Typography className={classes.fieldValue}>{initialValues ? initialValues.phone : ''}</Typography>
									)}

									{isEditMode && (
										<FormControl
											fullWidth
											className={errors.phone ? classes.phoneInput : classes.phoneInputError}
											error={!!errors.phone}
										>
											<Controller
												render={({ field }) => (
													<PhoneInputComponent
														{...field}
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
													{errors.phone.message}
												</FormHelperText>
											)}
										</FormControl>
									)}
								</Grid>
							)}

							{(isBrandAdmin || isSuperAdmin || isOwner) && (
								<Grid item sm={4} xs={12}>
									<Typography className={classes.fieldTitle}>Email</Typography>
									{!isEditMode && (
										<Typography className={classes.fieldValue}>{initialValues ? initialValues.email : ''}</Typography>
									)}
									{isEditMode && (
										<FormControl fullWidth error={!!errors.email}>
											<Controller
												render={({ field }) => (
													<TextField
														{...field}
														variant="outlined"
														disabled={isSaving}
														error={!!errors.email}
														helperText={errors.email ? errors.email.message : ''}
														style={{ marginTop: 0 }}
													/>
												)}
												rules={{ validate: handleEmailValidation, required: 'Field is required' }}
												name="email"
												control={control}
											/>
											{errors.email && (
												<FormHelperText style={{ paddingLeft: 15 }} error>
													{errors.email.message}
												</FormHelperText>
											)}
										</FormControl>
									)}
								</Grid>
							)}

							{(isBrandAdmin || isSuperAdmin || isOwner) && <Divider variant="middle" className={classes.middleSpacer} />}

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
								{(isBrandAdmin || isSuperAdmin) && isEditMode && (
									<Controller
										render={({ field }) => (
											<AutocompleteAsync
												type="brand"
												filter={{ includeIds: initialValues?.brandId ? [initialValues.brandId] : [] } as BrandFilter}
												label="Brand"
												{...field}
												showLabel={false}
												disabled={!isSuperAdmin}
											/>
										)}
										name="brandId"
										rules={{ required: 'Field is required' }}
										control={control}
									/>
								)}

								{!isBrandAdmin && !isSuperAdmin && (
									<Typography className={classes.fieldValue}>
										{initialValues && initialValues.brand && initialValues.brand.name}
									</Typography>
								)}
							</Grid>

							<Grid item sm={4} xs={12}>
								{(isBrandAdmin || isSuperAdmin) && (
									<>
										<Typography className={classes.fieldTitle}>Role</Typography>
										{!isEditMode && (
											<Typography className={classes.fieldValue}>{initialValues ? initialValues?.role?.name : ''}</Typography>
										)}

										{isEditMode && (
											<SelectRoleComponent
												control={control}
												showLabel={false}
												disabled={!isSuperAdmin && !isBrandAdmin}
												required
												filter={{
													brandId,
													type: allowedRoleTypes,
												}}
											/>
										)}
									</>
								)}
							</Grid>

							{currentRole && currentRole.roleType === BrandRoleType.VENUE_ADMIN && (
								<Grid item sm={12} xs={12}>
									<VenueChipsBlock
										onChange={setAdminVenues}
										isReadOnly={!isSuperAdmin && !isBrandAdmin}
										brandId={brandId}
										error={venueAdminError}
										initialValues={initialValues && initialValues.adminVenues ? initialValues.adminVenues : []}
									/>
								</Grid>
							)}

							{((!isEditMode && !!initialValues?.about && initialValues?.about !== '') || isEditMode) && (
								<Divider variant="middle" className={classes.middleSpacer} />
							)}

							{!isEditMode && !!initialValues?.about && initialValues?.about !== '' && (
								<Grid item sm={8} xs={12}>
									<Typography className={classes.fieldTitle}>About</Typography>
									<Typography className={classes.fieldValue}>{initialValues ? initialValues.about : ''}</Typography>
								</Grid>
							)}

							{isEditMode && (
								<Grid item sm={8} xs={12}>
									<Typography className={classes.fieldTitle}>About</Typography>
									<FormControl fullWidth>
										<Controller
											render={({ field }) => (
												<TextField
													{...field}
													variant="outlined"
													error={!!errors.about}
													helperText={errors.about ? errors.about.message : ''}
													disabled={isSaving}
													multiline
												/>
											)}
											name="about"
											control={control}
										/>
									</FormControl>
								</Grid>
							)}
						</Grid>

						{isEditMode && (isSuperAdmin || isBrandAdmin) && (
							<>
								<Waypoint onEnter={() => setActiveTab('billing')} />
								<Typography id="billing" className={classes.tabTitleWrapper}>
									Billing
								</Typography>

								<Grid container spacing={3} className={classes.container}>
									<Grid item sm={4} xs={12}>
										<Controller
											name="userId"
											control={control}
											render={({ field }) => (
												<AutocompleteAsync
													{...field}
													type="user"
													label="Team lead"
													filter={
														{
															noTeamLead: true,
															brandId: initialValues ? String(initialValues.brandId) : undefined,
														} as UserFilterInterface
													}
												/>
											)}
										/>
									</Grid>
									{initialValues && (
										<Grid item sm={8} xs={12}>
											{userCC.length === 0 && <Typography>No cards</Typography>}
											{userCC.length > 0 && (
												<Table aria-label="simple table">
													<TableBody>
														{userCC.map((cc: any) => (
															<TableRow className={classes.tableRow} key={cc.id}>
																<TableCell className={classes.tableCell}>
																	<img
																		src={CCAvatar(cc.brand)}
																		width={70}
																		alt={cc.brand}
																		style={{ marginRight: 15, marginBottom: '-15px' }}
																	/>
																	<Typography component="span">
																		<b>{` *${cc.last4}`}</b>
																		{cc.isDefault && ' (Primary)'}
																	</Typography>
																</TableCell>
																<TableCell className={classes.tableCell}>
																	<Typography>
																		Exp. - {cc.exp_month} / {cc.exp_year}
																	</Typography>
																</TableCell>

																<TableCell align="right" className={classes.tableCell}>
																	{!cc.isDefault && (
																		<Button
																			variant="contained"
																			endIcon={<StarIcon />}
																			color="primary"
																			onClick={() => handleSetDefault(cc.id)}
																		>
																			Make primary
																		</Button>
																	)}
																</TableCell>

																<TableCell align="right" className={classes.tableCell}>
																	<Button
																		variant="contained"
																		endIcon={<ChevronRightIcon />}
																		color="primary"
																		onClick={() => handleEditCard(cc)}
																	>
																		Edit
																	</Button>

																	<Button
																		variant="contained"
																		endIcon={<DeleteIcon />}
																		color="secondary"
																		onClick={() => onDeleteRequest(cc)}
																		style={{ marginLeft: 15 }}
																	>
																		Delete
																	</Button>
																</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											)}

											<Button
												variant="contained"
												color="primary"
												endIcon={<AddIcon />}
												size="large"
												onClick={onAddCardShow}
												style={{ marginTop: 15 }}
											>
												Add a new card
											</Button>
										</Grid>
									)}
								</Grid>
							</>
						)}

						{initialValues && (isSuperAdmin || isBrandAdmin) && (
							<>
								<Waypoint onEnter={() => setActiveTab('team')} />
								<Typography className={classes.tabTitleWrapper} id="team">
									Team
								</Typography>

								<Grid container spacing={1} className={classes.container}>
									<Grid item sm={12} xs={12}>
										{renderTeamName()}
									</Grid>
								</Grid>
							</>
						)}

						{userId && userId !== '0' && isEditMode && (isSuperAdmin || isBrandAdmin) && (
							<>
								<Waypoint onEnter={() => setActiveTab('membership')} />

								<Typography className={classes.tabTitleWrapper} id="membership">
									Membership
									<Button color="primary" onClick={() => setSubscriptionVisible(true)} startIcon={<AddIcon />}>
										Add new subscription
									</Button>
								</Typography>

								<UserSubscriptionsTableComponent
									subscriptions={userSubs as unknown as SubFormValues[]}
									onCancel={doRefresh}
									onEditBtnClick={handleSubEdit}
									isInputLoading={isSubSaving}
								/>
							</>
						)}
					</StickyContainer>

					{Object.keys(errors).length > 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Divider />
								<Typography className={classes.errorText}>You have errors in form. Please fill in all required fields.</Typography>
								<Divider />
							</Grid>
						</Grid>
					)}

					{isEditMode && (
						<Grid container spacing={3} className={classes.bottomWrap}>
							<Grid item xs={12} md={8} className={classes.bottomWrap}>
								{userId !== '0' && (
									<>
										{(isSuperAdmin || isBrandAdmin) && (
											<Button
												type="button"
												size="large"
												className={classes.btnText}
												disabled={initialValues && initialValues.status === UserStatus.DELETED}
												startIcon={<DeleteIcon className={classes.deleteIcon} />}
												onClick={() => setConfirmDeleteDialogVisible(true)}
											>
												Delete Member
											</Button>
										)}

										{(isSuperAdmin || isBrandAdmin) && (
											<Button
												type="button"
												size="large"
												className={classes.btnText}
												startIcon={<PauseIcon className={classes.suspendIcon} />}
												onClick={() => setConfirmSuspendDialogVisible(true)}
											>
												{initialValues && initialValues.status === UserStatus.SUSPENDED ? 'Reactivate ' : 'Suspend '}
												Member
											</Button>
										)}

										{(isSuperAdmin || isBrandAdmin) && (
											<Button
												type="button"
												size="large"
												className={classes.btnText}
												startIcon={<ArrowRightAltIcon className={classes.moveOutIcon} />}
												onClick={() => setConfirmMoveOutDialogVisible(true)}
											>
												{initialValues && initialValues.status !== UserStatus.MOVEOUT ? 'Deactivate' : 'Reactivate'}
											</Button>
										)}

										{(isSuperAdmin || isBrandAdmin) && (
											<Button
												type="button"
												size="large"
												className={classes.btnText}
												disabled={!initialValues}
												startIcon={<SupervisorAccountIcon className={classes.moveOutIcon} />}
												onClick={handleMakeUnMakeAdmin}
											>
												{initialValues && initialValues.isAdmin ? 'Unmake Admin' : 'Make Admin'}
											</Button>
										)}
									</>
								)}
							</Grid>
							<Grid item xs={12} md={4} className={classes.bottomWrap}>
								<Button
									variant="contained"
									color="secondary"
									type="button"
									size="large"
									style={{ marginTop: 15, marginRight: 15 }}
									onClick={() => navigate(-1)}
								>
									Cancel
								</Button>

								<Button variant="contained" color="primary" type="submit" size="large" style={{ marginTop: 15 }}>
									Save
								</Button>
							</Grid>
						</Grid>
					)}

					<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Paper>
			</form>

			<Dialog onClose={() => setImageEditVisible(false)} open={imageEditVisible}>
				<ImageEditor image={editingImage} aspectRatio={16 / 9} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>

			<Dialog onClose={handleClosePhotoPreview} open={photoPreviewVisible}>
				<img src={photoPreview} alt="" style={{ width: '100%' }} />
				<DialogActions>
					<Button onClick={handleClosePhotoPreview} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<ConfirmDialog
				actionText="Delete"
				text={`Are you sure you want to remove ${getValues('firstname')} ${getValues('lastname')}?`}
				open={confirmDeleteDialogVisible}
				onClose={() => setConfirmDeleteDialogVisible(false)}
				action={handleDelete}
			/>

			<ConfirmDialog
				actionText={initialValues && initialValues.status !== UserStatus.MOVEOUT ? 'Deactivate' : 'Reactivate'}
				text={`Are you sure you want to ${
					initialValues && initialValues.status !== UserStatus.MOVEOUT ? 'deactivate' : 'reactivate'
				} ${getValues('firstname')} ${getValues('lastname')}?`}
				open={confirmMoveOutDialogVisible}
				onClose={() => setConfirmMoveOutDialogVisible(false)}
				action={handleMoveout}
			/>

			<ConfirmDialog
				actionText={initialValues && initialValues.status === UserStatus.SUSPENDED ? 'Reactivate' : 'Suspend'}
				text={`Are you sure you want to ${
					initialValues && initialValues.status === UserStatus.SUSPENDED ? 'reactivate' : 'suspend'
				} ${getValues('firstname')} ${getValues('lastname')}?`}
				open={confirmSuspendDialogVisible}
				onClose={() => setConfirmSuspendDialogVisible(false)}
				action={handleSuspend}
			/>

			<Dialog open={!!deletingCard} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
				<DialogActions>
					<Button onClick={closeDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteCard} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>

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

			<Dialog
				onClose={() => {
					setEditingSub(undefined);
					setSubscriptionVisible(false);
				}}
				open={subscriptionVisible}
				maxWidth="md"
			>
				<DialogContent>
					<FormSubscriptionComponent
						brandId={brandId}
						initialValues={editingSub}
						user={initialValues as UserInterface}
						onSave={handleSubscriptionSave}
						onCancel={() => {
							setEditingSub(undefined);
							setSubscriptionVisible(false);
						}}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={changePassVisible} onClose={() => setChangePassVisible(false)} maxWidth="sm" fullWidth>
				<FormChangePassComponent userId={String(initialValues?.id)} onSave={() => setChangePassVisible(false)} />
			</Dialog>

			<Dialog open={selectTeamVisible} onClose={() => setSelectTeamVisible(false)} maxWidth="sm" fullWidth>
				<FormChangePassComponent userId={String(initialValues?.id)} onSave={() => setSelectTeamVisible(false)} />
			</Dialog>

			<SelectCompanyDialogComponent
				userId={Number(userId)}
				open={editCompanyVisible}
				onClose={onCompanySelectClose}
				onCancel={onCompanySelectClose}
			/>

			{initialValues && (
				<AddCCComponent
					open={addCardVisible}
					onClose={onAddCardClose}
					onAdded={onAddCard}
					userId={String(userId)}
					initialValues={editingCard}
				/>
			)}
		</>
	);
}

export default memo(FormMemberComponent);
