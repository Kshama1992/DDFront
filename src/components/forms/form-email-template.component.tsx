import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import { Controller, useForm } from 'react-hook-form';
import EmailEditor from 'react-email-editor';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import * as EmailValidator from 'email-validator';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Tooltip from '@mui/material/Tooltip';
import DialogTitle from '@mui/material/DialogTitle';
import EntityStatus from 'dd-common-blocks/dist/type/EntityStatus';
import EmailTemplateInterface from 'dd-common-blocks/dist/interface/email-template.interface';
import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';
import EmailVariableInterface from 'dd-common-blocks/dist/interface/email-variable.interface';
import SelectStatusComponent from '@forms/elements/select-status.component';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import { UNLAYER_PROJECT_ID } from '@core/config';
import EmailTemplateService from '@service/email-template.service';
import LoadingButton from '@forms/elements/loading-button.component';
import EmailTemplateTypeService from '@service/email-template-type.service';
import EmailTemplateFormValuesInterface from '@forms/interface/email-template-form-values.interface';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';

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
		switch: {
			marginLeft: 15,
		},
		container: {
			padding: 35,
		},

		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 14,
		},
		switchLabel: {
			marginLeft: 0,
		},
		timeField: {
			maxWidth: 100,
		},
		hoursField: {
			maxWidth: 60,
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
		},
		variableItemRoot: {
			width: '33%',
		},
		unlayerEditorWrap: {
			'& > div': {
				width: '100% !important',
				display: 'flex !important',
				flex: '1 !important',
			},
			'& iframe': {
				flex: 1,
				width: '100% !important',
				height: '100% !important',
				minWidth: 'auto !important',
				display: 'flex !important',
				border: 0,
			},
		},
	})
);

export default function FormEmailTemplateComponent({ initialValues }: { initialValues?: EmailTemplateInterface }) {
	const classes = useStyles({});
	const navigate = useNavigate();
	const templateService = new EmailTemplateService();
	const templateTypeService = new EmailTemplateTypeService();
	const { showSnackBar } = useContext(SnackBarContext);
	const { isSuperAdmin, authBody } = useContext(AuthContext);
	const emailEditorRef = useRef(null);

	const mergeTags: any = {};

	const [imageTags, setImageTags] = useState<string[]>([]);

	const [typesList, setTypesList] = useState<EmailTemplateTypeInterface[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
	const [testEmailVisible, setTestEmailVisible] = useState(false);
	const [testEmail, setTestEmail] = useState('');

	const handleClickOpen = () => {
		setTestEmailVisible(true);
	};

	const handleClose = () => {
		setTestEmailVisible(false);
	};

	const [selectedType, setSelectedType] = useState<EmailTemplateTypeInterface | undefined>(initialValues?.emailTemplateType);

	useEffect(() => {
		if (selectedType) {
			const tempVars: any = selectedType.templateVariables
				.filter((v) => !v.parentId)
				.map((v) => ({ value: v.name, name: v.description || v.name, id: v.id, child: [] }));

			selectedType.templateVariables
				.filter((v) => v.parentId)
				.forEach((variable) => {
					const index = tempVars.findIndex((i: EmailVariableInterface) => Number(i.id) === Number(variable.parentId));
					if (index !== -1) {
						tempVars[index].child.push({
							id: variable.id,
							value: variable.name,
							name: variable.name,
							description: variable.description,
							child: [],
						});
					}
				});

			const tempImageTags: string[] = [];

			tempVars.forEach((t: any) => {
				mergeTags[t.name] = {
					name: t.description || t.name,
				};

				if (t.value === 'lines') {
					mergeTags[t.name].rules = {
						repeat: {
							name: 'Repeat for Each Invoice line',
							before: '{{#each lines}}',
							after: '{{/each}}',
						},
					};

					mergeTags[t.name].mergeTags = {};
					t.child.forEach((c: any) => {
						mergeTags[t.name].mergeTags[c.name] = {
							name: c.description || c.name,
							value: `{{this.${c.value}}}`,
						};
					});
				} else if (t.value === 'providerInvoiceItems') {
					mergeTags[t.name].rules = {
						repeat: {
							name: 'Repeat for Each Provider Invoice line',
							before: '{{#each providerInvoiceItems}}',
							after: '{{/each}}',
						},
					};

					mergeTags[t.name].mergeTags = {};
					t.child.forEach((c: any) => {
						mergeTags[t.name].mergeTags[c.name] = {
							name: c.description || c.name,
							value: `{{this.${c.value}}}`,
						};
					});
				} else if (t.child.length) {
					mergeTags[t.name].mergeTags = {};
					t.child.forEach((c: any) => {
						const value = `{{${t.value}.${c.value}}}`;
						if (['photo', 'logo', 'image'].includes(c.value)) {
							tempImageTags.push(value);
						} else {
							mergeTags[t.name].mergeTags[c.name] = {
								name: c.description || c.name,
								value,
							};
						}
					});
				} else {
					mergeTags[t.name].value = `{{${t.value}}}`;
				}
			});
			// @ts-ignore
			emailEditorRef?.current?.editor?.setMergeTags(mergeTags);

			setImageTags(tempImageTags);
		}
	}, [selectedType]);

	const emptyItem = {
		brandId: !isSuperAdmin && !initialValues ? authBody?.brandId : undefined,
		status: EntityStatus.ACTIVE,
	};

	const {
		handleSubmit,
		control,
		watch,
		getValues,
		formState: { errors },
	} = useForm<EmailTemplateFormValuesInterface>({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : emptyItem,
	});

	const brandId = watch('brandId');

	const loadTypes = useCallback(
		async (inputBrandId: number) => {
			const [templates] = await templateService.list({ limit: 150, brandId: inputBrandId });
			const [list] = await templateTypeService.list();

			setTypesList(
				list.filter((tt: EmailTemplateTypeInterface) => {
					if (initialValues && initialValues.emailTemplateTypeId === tt.id) return true;
					return !templates
						.filter((t: EmailTemplateInterface) => t.brandId === inputBrandId)
						.map((t: EmailTemplateInterface) => t.emailTemplateTypeId)
						.includes(Number(tt.id));
				})
			);
			if (initialValues && initialValues.emailTemplateTypeId) {
				setSelectedType(list.find((t1) => t1.id === Number(initialValues.emailTemplateTypeId)));
			}
		},
		[typesList]
	);

	useEffect(() => {
		loadTypes(brandId).then();
	}, [brandId]);

	useEffect(() => {
		if (initialValues && initialValues.unlayerDesign) {
			setTimeout(() => {
				// @ts-ignore
				emailEditorRef?.current?.editor?.loadDesign(initialValues.unlayerDesign);
				// @ts-ignore
				emailEditorRef?.current?.editor?.setMergeTags(mergeTags);
			}, 500);
		}
	}, [emailEditorRef]);

	const handleSendTest = async () => {
		if (!initialValues) return;

		setIsEmailSending(true);

		const cloneData = getValues() as EmailTemplateInterface;
		const itemId = initialValues && initialValues.id ? initialValues.id : null;

		// @ts-ignore
		emailEditorRef?.current?.editor.exportHtml(async (data: any) => {
			try {
				const { design, html } = data;
				cloneData.html = html;
				cloneData.unlayerDesign = design;

				if (authBody && authBody.id) cloneData.updatedById = authBody.id;
				await templateService.save(cloneData, itemId);
				await templateService.test(String(initialValues?.id), testEmail);
				showSnackBar('Email sent!');
			} catch (e) {
				const { message } = e as Error;
				showSnackBar(message);
			} finally {
				setIsEmailSending(false);
				setTestEmailVisible(false);
			}
		});
	};

	const handleEmailValidation = async (email: any) => {
		const isValidSyntax = EmailValidator.validate(email);
		if (!isValidSyntax) return 'Email format is wrong';
		return true;
	};

	const emailTemplateTypeId = watch('emailTemplateTypeId');

	useEffect(() => {
		if (emailTemplateTypeId) setSelectedType(typesList.find((t) => t.id === emailTemplateTypeId));
	}, [emailTemplateTypeId]);

	const save = async (formData: EmailTemplateInterface) => {
		setIsSaving(true);

		const cloneData = formData;
		const itemId = initialValues && initialValues.id ? initialValues.id : null;

		// @ts-ignore
		emailEditorRef?.current?.editor.exportHtml(async (data: any) => {
			try {
				const { design, html } = data;
				cloneData.html = html;
				cloneData.unlayerDesign = design;

				if (itemId) {
					cloneData.updatedById = Number(authBody?.id);
				} else {
					cloneData.createdById = Number(authBody?.id);
				}
				await templateService.save(cloneData, itemId);
				navigate('/dashboard/email-templates');
				showSnackBar('Email saved!');
			} catch (e) {
				const { message } = e as Error;
				showSnackBar(message);
			}
		});
	};

	const isDefaultTemplate = initialValues && !initialValues.brandId;

	return (
		<>
			<form onSubmit={handleSubmit((d) => save(d as EmailTemplateInterface))} className={classes.root}>
				<Paper>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.backContainer}>
							<Button
								className={classes.backLink}
								onClick={() => navigate('/dashboard/email-templates')}
								startIcon={<ChevronLeftIcon className={classes.backIcon} />}
							>
								<Typography>Back to list</Typography>
							</Button>
						</Grid>
					</Grid>

					<Grid container spacing={3} style={{ marginTop: 5 }} className={classes.container}>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.name}
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												label="Template Name"
												disabled={isDefaultTemplate && !isSuperAdmin}
												helperText={errors.name ? errors.name.message : ''}
											/>
										)}
										rules={{ required: 'Field is required' }}
										name="name"
										control={control}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.fromName}
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												label="From Name"
												disabled={isDefaultTemplate && !isSuperAdmin}
												helperText={errors.fromName ? errors.fromName.message : ''}
											/>
										)}
										rules={{ required: 'Field is required' }}
										name="fromName"
										control={control}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.fromEmail}
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												label="From Email"
												disabled={isDefaultTemplate && !isSuperAdmin}
												helperText={errors.fromEmail ? errors.fromEmail.message : ''}
											/>
										)}
										rules={{ validate: handleEmailValidation, required: 'Field is required' }}
										name="fromEmail"
										control={control}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<SelectStatusComponent
										control={control}
										required
										error={errors.status}
										disabled={isDefaultTemplate && !isSuperAdmin}
									/>
								</Grid>

								<Grid item xs={12}>
									<Controller
										render={({ field }) => (
											<TextField
												{...field}
												error={!!errors.subject}
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												disabled={isDefaultTemplate && !isSuperAdmin}
												label="Subject"
												helperText={errors.subject ? errors.subject.message : ''}
											/>
										)}
										rules={{ required: 'Field is required' }}
										name="subject"
										control={control}
									/>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12} md={5}>
							<Controller
								render={({ field }) => (
									<AutocompleteAsync
										type="brand"
										label="Brand"
										filter={{ includeIds: initialValues?.brandId ? [initialValues.brandId] : [] } as BrandFilter}
										{...field}
										disabled={!isSuperAdmin || (initialValues && !initialValues.brandId)}
									/>
								)}
								name="brandId"
								rules={{ required: isSuperAdmin ? false : 'Field is required' }}
								control={control}
							/>
						</Grid>
						{typesList.length > 0 && (
							<Grid item xs={12} md={5}>
								<FormControl fullWidth error={!!errors.emailTemplateTypeId}>
									<InputLabel shrink id="select-type-label">
										Template Type
									</InputLabel>

									<Controller
										render={({ field }) => (
											<Select
												{...field}
												variant="outlined"
												placeholder="Email template type"
												labelId="select-type-label"
												disabled={initialValues && !initialValues.brandId}
											>
												{typesList.map((i: EmailTemplateTypeInterface) => (
													<MenuItem value={i.id} key={i.id}>
														{i.name}
													</MenuItem>
												))}
											</Select>
										)}
										name="emailTemplateTypeId"
										control={control}
										rules={{ required: 'This field is Required' }}
									/>
								</FormControl>
							</Grid>
						)}

						{imageTags.length > 0 && (
							<Grid item xs={12}>
								<Typography>
									The images variables you can use are: {imageTags.toString()}.
									<br />
									Input them into the url field on the right panel after selecting image component for content
								</Typography>
							</Grid>
						)}

						<Grid item xs={12}>
							<div className={classes.unlayerEditorWrap}>
								<EmailEditor projectId={Number(UNLAYER_PROJECT_ID)} ref={emailEditorRef} />
							</div>
						</Grid>
					</Grid>

					<Divider />

					<Grid container spacing={3} className={classes.bottomWrap}>
						<Grid item xs={12} className={classes.bottomWrap}>
							<Button
								variant="contained"
								color="secondary"
								type="button"
								size="large"
								disabled={isSaving}
								style={{ marginTop: 15, marginRight: 15 }}
								onClick={() => navigate('/dashboard/email-templates')}
							>
								Cancel
							</Button>

							<LoadingButton
								text="Save"
								size="large"
								style={{ marginTop: 15 }}
								isLoading={isSaving}
								disabled={!isSuperAdmin && initialValues && !initialValues.brandId}
							/>

							{initialValues && (
								<Button
									variant="contained"
									disabled={isSaving}
									color="primary"
									type="button"
									size="large"
									style={{ marginTop: 15, marginLeft: 15 }}
									onClick={handleClickOpen}
								>
									Test email
								</Button>
							)}

							{!initialValues && (
								<Tooltip title="You need to save template first" aria-label="add">
									<Button
										variant="contained"
										disabled
										color="primary"
										type="button"
										size="large"
										style={{ marginTop: 15, marginLeft: 15 }}
										onClick={handleClickOpen}
									>
										Test email
									</Button>
								</Tooltip>
							)}
						</Grid>
					</Grid>
				</Paper>
			</form>

			<Dialog open={testEmailVisible} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Test template</DialogTitle>
				<DialogContent>
					<DialogContentText>To test email template, please enter your email address here.</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Email Address"
						type="email"
						fullWidth
						onChange={(e) => setTestEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<LoadingButton text="Test" isLoading={isEmailSending} onClick={handleSendTest} type="button" />
				</DialogActions>
			</Dialog>
		</>
	);
}
