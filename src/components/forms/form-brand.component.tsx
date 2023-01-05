import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import EmailEditor from 'react-email-editor';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useNavigate, useParams } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import BrandService from '@service/brand.service';
import { SnackBarContext } from '@context/snack-bar.context';
import UploadFileHelper from '@helpers/file-upload.helper';
import CheckboxComponent from '@forms/elements/checkbox.component';
import { UNLAYER_PROJECT_ID } from '@core/config';
import ConfirmDialog from '@shared-components/confirm.dialog';
import ImageEditor from '@shared-components/image-editor.component';
import LoadingButton from '@forms/elements/loading-button.component';
import FormBrandStyles from '@forms/styles/form-brand.styles';

function FormBrandComponent({ initialValues }: { initialValues?: BrandInterface }) {
	const classes = FormBrandStyles({});
	const navigate = useNavigate();

	const { showSnackBar } = useContext(SnackBarContext);

	if (initialValues?.stripePrivateKey === null) initialValues.stripePrivateKey = '';
	if (initialValues?.stripePublicKey === null) initialValues.stripePublicKey = '';

	const brandService = new BrandService();

	const { brandId } = useParams();

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);

	const [photoPreview, setPhotoPreview] = useState<string>('');
	const [photoPreviewVisible, setPhotoPreviewVisible] = useState<boolean>(false);

	const [editingImageType, setEditingImageType] = useState<'logo' | 'bg'>('logo');
	const [editingImage, setEditingImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);

	const [logo, setLogo] = useState<string>(
		initialValues && initialValues.logo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${initialValues.logo.url}` : ''
	);
	const [uploadLogo, setUploadLogo] = useState<string>();
	const [uploadBg, setUploadBg] = useState<string>();

	const [background, setBackground] = useState<string>(
		initialValues && initialValues.background ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${initialValues.background.url}` : ''
	);

	const [logoError, setLogoError] = useState<string>('');
	const [bgError, setBgError] = useState<string>('');

	const ppEditorRef = useRef(null);
	const tosEditorRef = useRef(null);

	useEffect(() => {
		if (initialValues && initialValues.privacyPolicy) {
			setTimeout(() => {
				// @ts-ignore
				ppEditorRef?.current?.editor?.loadDesign(initialValues.unlayerPP);
			}, 500);
		}
	}, [ppEditorRef]);

	useEffect(() => {
		if (initialValues && initialValues.userTerms) {
			setTimeout(() => {
				// @ts-ignore
				tosEditorRef?.current?.editor?.loadDesign(initialValues.unlayerTOS);
			}, 500);
		}
	}, [tosEditorRef]);

	const emptyBrand = {
		name: '',
		domain: '',
		stripePublicKey: '',
		stripePrivateKey: '',
		privacyPolicy: '',
		userTerms: '',
		chargeCustomer: false,
	};

	const {
		handleSubmit,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : emptyBrand,
	});

	const bgRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const logoRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const setImageError = (text: string, type: 'logo' | 'bg') => {
		if (type === 'logo') setLogoError(text);
		if (type === 'bg') setBgError(text);
	};

	const clearImageError = (type: 'logo' | 'bg') => {
		if (type === 'logo') setLogoError('');
		if (type === 'bg') setBgError('');
	};

	const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'bg') => {
		clearImageError(type);
		try {
			const base64: string = await UploadFileHelper(event);
			setEditingImageType(type);
			setEditingImage(base64);
			setImageEditVisible(true);
		} catch (e) {
			const { message } = e as Error;
			setImageError(message, type);
		} finally {
			if (typeof bgRef !== 'undefined' && typeof bgRef.current !== 'undefined') {
				// @ts-ignore
				bgRef.current.value = '';
			}
			if (typeof logoRef !== 'undefined' && typeof logoRef.current !== 'undefined') {
				// @ts-ignore
				logoRef.current.value = '';
			}
		}
	};

	const onUploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => onUploadFile(event, 'logo');
	const onUploadBg = (event: React.ChangeEvent<HTMLInputElement>) => onUploadFile(event, 'bg');

	const handleImageSave = (base64Image: string) => {
		if (editingImageType === 'logo') {
			setLogo(base64Image);
			setUploadLogo(base64Image);
		} else {
			setBackground(base64Image);
			setUploadBg(base64Image);
		}
		setEditingImage('');
		setImageEditVisible(false);
	};

	const handleClosePhotoPreview = () => {
		setPhotoPreview('');
		setPhotoPreviewVisible(false);
	};

	const save = async (formData: BrandInterface) => {
		try {
			setIsSaving(true);

			const cloneData = formData;

			if (!cloneData.domain) {
				cloneData.domain = '';
			}

			if (uploadLogo) {
				cloneData.uploadLogo = uploadLogo;
			}

			if (uploadBg) {
				cloneData.uploadBg = uploadBg;
			}
			// @ts-ignore
			ppEditorRef?.current?.editor.exportHtml((ppdata) => {
				const { html: privacyPolicyHTML, design: ppDesign } = ppdata;

				// @ts-ignore
				return tosEditorRef?.current?.editor.exportHtml(async (tosData) => {
					const { html: TOSHTML, design: TOSDesign } = tosData;
					cloneData.privacyPolicy = privacyPolicyHTML;
					cloneData.userTerms = TOSHTML;

					cloneData.unlayerPP = ppDesign;
					cloneData.unlayerTOS = TOSDesign;

					try {
						await brandService.save(cloneData, brandId);
						navigate('/dashboard/brand');
						showSnackBar('Brand saved!');
					} catch (e) {
						const { message } = e as Error;
						showSnackBar(message);
					} finally {
						setIsSaving(false);
					}
				});
			});
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
			if (typeof brandId !== 'undefined') {
				await brandService.delete(brandId);
				navigate('/dashboard/brand');
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(save)} className={classes.root}>
				<Paper>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.backContainer}>
							<Button
								className={classes.backLink}
								onClick={() => navigate('/dashboard/brand')}
								startIcon={<ChevronLeftIcon className={classes.backIcon} />}
							>
								<Typography>Back to brand list</Typography>
							</Button>
						</Grid>
					</Grid>

					<Grid container spacing={3} className={classes.container}>
						<Grid item xs={12} md={6} className={classes.uploadLogoWrap}>
							<input className={classes.uploadInput} id="new-item-avatar" ref={logoRef} type="file" onChange={onUploadBg} />
							<label htmlFor="new-item-avatar" className={classes.avaLbl}>
								{!background && (
									<IconButton className={classes.avatarSquare} component="span" size="large">
										<>
											<AddIcon />
											<Typography>Add Background</Typography>
										</>
									</IconButton>
								)}
								{background && <Avatar src={background || '/images/logo-small.png'} className={classes.avatarSquare} />}
							</label>
							{bgError !== '' && (
								<FormHelperText
									error
									className={classes.imageErrorText}
									style={{ textAlign: 'center', paddingTop: 25, marginTop: 25 }}
								>
									{bgError}
								</FormHelperText>
							)}
						</Grid>

						<Grid item xs={12} md={6} className={classes.uploadLogoWrap}>
							<input className={classes.uploadInput} id="new-item-bg" ref={bgRef} type="file" onChange={onUploadLogo} />
							<label htmlFor="new-item-bg" className={classes.avaLbl}>
								{!logo && (
									<IconButton className={classes.avatar} component="span" size="large">
										<>
											<AddIcon />
											<Typography>Add logo</Typography>
										</>
									</IconButton>
								)}
								{logo && <Avatar src={logo || '/images/logo-small.png'} className={classes.avatar} />}
							</label>
							{logoError !== '' && (
								<FormHelperText
									error
									className={classes.imageErrorText}
									style={{ textAlign: 'center', paddingTop: 25, marginTop: 25 }}
								>
									{logoError}
								</FormHelperText>
							)}
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										InputLabelProps={{ shrink: true }}
										variant="outlined"
										error={!!errors.name}
										helperText={errors.name ? errors.name.message : ''}
										label="Brand Name"
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
									<TextField
										{...field}
										fullWidth
										error={!!errors.domain}
										helperText={errors.domain ? errors.domain.message : ''}
										minRows={4}
										InputLabelProps={{ shrink: true }}
										onKeyUp={(e: any) => {
											if (e.target.value) {
												e.target.value = e.target.value.toLowerCase();
											}
										}}
										label="Domain"
										variant="outlined"
									/>
								)}
								name="domain"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										error={!!errors.stripePrivateKey}
										helperText={errors.stripePrivateKey ? errors.stripePrivateKey.message : ''}
										minRows={4}
										InputLabelProps={{ shrink: true }}
										variant="outlined"
										label="Stripe Private Key"
									/>
								)}
								name="stripePrivateKey"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										error={!!errors.stripePublicKey}
										helperText={errors.stripePublicKey ? errors.stripePublicKey.message : ''}
										minRows={4}
										InputLabelProps={{ shrink: true }}
										variant="outlined"
										label="Stripe Public Key"
									/>
								)}
								name="stripePublicKey"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<CheckboxComponent control={control} name="chargeCustomer" label="Charge Customer" />
						</Grid>

						<Grid item xs={12}>
							<Divider />

							<FormControl fullWidth>
								<InputLabel>Privacy Policy</InputLabel>
								<br />
								<div className={classes.unlayerEditorWrap}>
									<EmailEditor projectId={Number(UNLAYER_PROJECT_ID)} ref={ppEditorRef} />
								</div>

								<Controller render={({ field }) => <Input {...field} type="hidden" />} name="privacyPolicy" control={control} />
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<Divider />

							<FormControl fullWidth>
								<InputLabel>User Terms</InputLabel>
								<br />
								<div className={classes.unlayerEditorWrap}>
									<EmailEditor projectId={Number(UNLAYER_PROJECT_ID)} ref={tosEditorRef} />
								</div>

								<Controller render={({ field }) => <Input {...field} type="hidden" />} name="userTerms" control={control} />
							</FormControl>
							<Divider />
						</Grid>
					</Grid>

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
								onClick={() => navigate('/dashboard/brand')}
							>
								Cancel
							</Button>

							{typeof initialValues !== 'undefined' && initialValues.id && (
								<Button
									variant="outlined"
									color="secondary"
									size="large"
									onClick={() => setConfirmDialogVisible(true)}
									style={{ marginTop: 15, marginRight: 15 }}
								>
									Delete brand
								</Button>
							)}

							<LoadingButton text="Save brand" isLoading={isSaving} style={{ marginTop: 15 }} />
						</Grid>
					</Grid>

					<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Paper>
			</form>

			<Dialog onClose={() => setImageEditVisible(false)} open={imageEditVisible}>
				<ImageEditor
					image={editingImage}
					aspectRatio={editingImageType === 'logo' ? undefined : 16 / 9}
					onCancel={() => setImageEditVisible(false)}
					onSave={handleImageSave}
				/>
			</Dialog>

			<Dialog onClose={handleClosePhotoPreview} open={photoPreviewVisible}>
				<img src={photoPreview} alt="" style={{ width: '100%' }} />
				<DialogActions>
					<Button onClick={handleClosePhotoPreview} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			{confirmDialogVisible && (
				<ConfirmDialog
					text={`Are yoy sure to delete ${getValues('name')}?`}
					open={confirmDialogVisible}
					onClose={() => setConfirmDialogVisible(false)}
					action={handleDelete}
				/>
			)}
		</>
	);
}

export default memo(FormBrandComponent);
