import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';
import EmailVariableInterface from 'dd-common-blocks/dist/interface/email-variable.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import EmailTemplateTypeService from '@service/email-template-type.service';
import EmailVariablesService from '@service/email-variables.service';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import ConfirmDialog from '@shared-components/confirm.dialog';

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
		wrapper: {
			margin: theme.spacing(1),
			position: 'relative',
		},
		buttonProgress: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: -12,
			marginLeft: -12,
		},
	})
);

function FormEmailTypeComponent({ initialValues }: { initialValues?: EmailTemplateTypeInterface }) {
	const classes = useStyles({});
	const templateTypeService = new EmailTemplateTypeService();
	const emailVariableService = new EmailVariablesService();

	const { showSnackBar } = useContext(SnackBarContext);

	const { roleId } = useParams();
	const navigate = useNavigate();

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);
	const [variables, setVariables] = useState<EmailVariableInterface[]>([]);
	const [templateVariables, setTemplateVariables] = useState<EmailVariableInterface[]>(initialValues?.templateVariables || []);

	const [typesData, setTypesData] = useState<EmailTemplateTypeInterface[]>([]);
	const [typesDataLoading, setTypesDataLoading] = useState<boolean>(false);
	const [typesVisible, setTypesVisible] = useState<boolean>(false);

	const loadTypes = useCallback(async () => {
		setTypesDataLoading(true);
		const [data] = await templateTypeService.list();
		setTypesData(data);
		setTypesDataLoading(false);
	}, []);

	const loadVariables = useCallback(async () => {
		const [list] = await emailVariableService.list();
		setVariables(list);
	}, [setVariables]);

	const emptyItem = { name: '' };

	const {
		handleSubmit,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : emptyItem,
	});

	useEffect(() => {
		loadVariables().then();
	}, []);

	const save = async (formData: EmailTemplateTypeInterface) => {
		try {
			setIsSaving(true);

			const cloneData = formData;
			const itemId = initialValues && initialValues.id ? initialValues.id : null;

			cloneData.templateVariables = templateVariables;

			await templateTypeService.save(cloneData, itemId);
			showSnackBar('Email type saved!');
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDuplicateVarsShow = () => {
		if (typesVisible) {
			setTypesVisible(false);
		} else {
			loadTypes().then(() => setTypesVisible(true));
		}
	};

	const handleDuplicateVars = (templateType: EmailTemplateTypeInterface) => {
		setTemplateVariables(templateType.templateVariables);
		setTypesVisible(false);
	};

	const handleDelete = async () => {
		setIsSaving(true);
		setConfirmDialogVisible(false);
		try {
			if (typeof roleId !== 'undefined') {
				await templateTypeService.delete(roleId);
				navigate('/dashboard/email-template-type');
			}
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const getIsPermissionSelected = (permissionId: number | undefined) => {
		const found = templateVariables.find((p) => Number(p.id) === Number(permissionId));
		return typeof found !== 'undefined';
	};

	const handlePermissionSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		const variableId = Number(name.split('_').pop());
		const selectPermissionObj = variables.find((p) => p.id === variableId);

		if (checked) {
			if (typeof selectPermissionObj !== 'undefined') setTemplateVariables([...templateVariables, selectPermissionObj]);
		} else {
			const findIndex = templateVariables.findIndex((p) => p.id === variableId);
			const cloneArr = templateVariables;
			cloneArr.splice(findIndex, 1);
			setTemplateVariables([...cloneArr]);
		}
		// setChecked(event.target.checked);
	};

	return (
		<>
			<form onSubmit={handleSubmit(save)} className={classes.root}>
				<Paper>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.backContainer}>
							<Button
								className={classes.backLink}
								onClick={() => navigate('/dashboard/email-template-type')}
								startIcon={<ChevronLeftIcon className={classes.backIcon} />}
							>
								<Typography>Back to types list</Typography>
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
										error={!!errors.name}
										helperText={errors.name ? errors.name.message : ''}
										label="Type Name"
									/>
								)}
								rules={{ required: 'Field is required' }}
								name="name"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={3}>
							<div className={classes.wrapper}>
								<Button variant="contained" color="primary" disabled={typesDataLoading} onClick={handleDuplicateVarsShow}>
									Clone variables
								</Button>
								{typesDataLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body1" className={classes.label} style={{ padding: '25px 0' }}>
								Assign Variables
							</Typography>
							<Divider />

							<CustomScrollbar autoHide style={{ height: 400 }}>
								<List>
									{variables.map((variable: EmailVariableInterface) => (
										<ListItem key={variable.id} dense button>
											<ListItemIcon>
												<Checkbox
													edge="start"
													name={`variableId_${String(variable.id)}`}
													checked={getIsPermissionSelected(variable.id)}
													tabIndex={-1}
													onChange={handlePermissionSelect}
													disableRipple
													inputProps={{ 'aria-labelledby': String(variable.id) }}
												/>
											</ListItemIcon>
											<ListItemText primary={variable.name} secondary={variable.description} />
										</ListItem>
									))}
								</List>
							</CustomScrollbar>
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
								onClick={() => navigate('/dashboard/email-template-type')}
							>
								Cancel
							</Button>

							<Button variant="contained" color="primary" type="submit" size="large" style={{ marginTop: 15 }}>
								Save type
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

			<Dialog onClose={handleDuplicateVarsShow} open={typesVisible}>
				<DialogTitle>Select type to copy variables</DialogTitle>
				<List>
					{typesData.map((td) => (
						<ListItem button onClick={() => handleDuplicateVars(td)} key={td.id}>
							<ListItemText primary={td.name} />
						</ListItem>
					))}
				</List>
			</Dialog>
		</>
	);
}

export default memo(FormEmailTypeComponent);
