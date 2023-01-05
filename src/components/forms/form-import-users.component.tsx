import React, { memo, useContext, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { FormHelperText } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import GetAppIcon from '@mui/icons-material/GetApp';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import LinearProgress from '@mui/material/LinearProgress';
import PublishIcon from '@mui/icons-material/Publish';
import TableRow from '@mui/material/TableRow';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Link } from 'react-router-dom';
import BrandRoleType from 'dd-common-blocks/dist/type/BrandRoleType';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import SelectRoleComponent from '@forms/elements/select-role.component';
import { AuthContext } from '@context/auth.context';
import UserService from '@service/user.service';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: 'flex',
			flexDirection: 'column',
			margin: 'auto',
			width: '100%',
			'& .MuiFormLabel-root': {
				top: -10,
			},
		},

		uploadInput: {
			display: 'none',
		},
		uploadLogoWrap: {
			display: 'flex',
			justifyContent: 'flex-start',
			flexDirection: 'column',
			alignItems: 'center',
		},
		container: {},
		errorText: {
			textAlign: 'center',
			margin: '15px 0',
			color: 'red',
		},
		middleSpacer: {
			margin: '30px 0',
			width: '100%',
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
		tableHeaderCell: {
			textTransform: 'capitalize',
		},
		rowError: {
			backgroundColor: 'red',
			color: 'white',
			'& td': {
				color: 'white',
			},
		},
	})
);

interface ImportUserInterface extends UserInterface {
	isValidEmail?: null | boolean;
	isValidPhone?: null | boolean;
	isValidUsername?: null | boolean;
	hasError?: boolean;
}

function FormImportUsersComponent({ onImportDone, onCancel, open }: { onCancel?: () => void; onImportDone?: () => void; open: boolean }) {
	const classes = useStyles({});
	const userService = new UserService();

	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const [fileError, setFileError] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [importingUsers, setImportingUsers] = useState<Partial<ImportUserInterface[]>>([]);

	const [validationInProgress, setValidationInProgress] = useState<boolean>(false);
	const [importErrors, setImportErrors] = useState<string[]>([]);

	const {
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<{ brandId: string; roleId: string }>({
		defaultValues: {
			brandId: isBrandAdmin ? String(authBody?.brandId) : undefined,
			roleId: '',
		},
	});

	const bgRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const getRandomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));

	const generatePassword = () => {
		const length = 21;
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let retVal = '';

		for (let i = 0, n = charset.length; i < length; i += 1) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	};

	const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setImportingUsers([]);
		setImportErrors([]);
		try {
			if (event.target.files && event.target.files.length) {
				setValidationInProgress(true);
				const reader = new window.FileReader();
				const file = event.target.files[0];
				reader.onloadend = async () => {
					const xlsx = await import('xlsx');

					const readedData = xlsx.read(reader.result, { type: 'binary' });
					const wsname = readedData.SheetNames[0];
					const ws = readedData.Sheets[wsname];

					const dataParse = xlsx.utils.sheet_to_json(ws, { header: 1 });

					const usersToImport: Partial<ImportUserInterface[]> = [];
					const headers: any = dataParse[0];

					if (headers.length < 3 || headers[0] !== 'firstname') {
						setImportErrors(['Excel file is not valid']);
						setValidationInProgress(false);
						return;
					}

					dataParse.forEach((d, i) => {
						if (i !== 0) {
							if (Array.isArray(d) && d.length) {
								const newUser: any = {};
								d.forEach((dSub: string, i2: number) => {
									newUser[headers[i2]] = dSub;
								});
								usersToImport.push(newUser);
							}
						}
					});

					// first show to user
					setImportingUsers(
						usersToImport.map((u) => ({
							...u,
							isValidPhone: null,
							isValidEmail: null,
							isValidUsername: null,
							password: generatePassword(),
							username: String(u?.phone) || `${String(u?.firstname)}_${String(u?.lastname)}_${getRandomInt(563)}`,
						}))
					);

					const errorsArr: string[] = [];

					// start validation
					const validatedItems = await Promise.all(
						usersToImport.map(async (u) => {
							const validationRes = await userService.validateImport({
								phone: String(u?.phone),
								email: String(u?.email),
								username: String(u?.username),
							});

							if (!validationRes.isValidEmail) {
								errorsArr.push(`Email ${u?.email} is already taken`);
							}
							if (!validationRes.isValidPhone) {
								errorsArr.push(`Phone ${u?.phone} is already taken`);
							}
							if (!validationRes.isValidUsername) {
								errorsArr.push(`Username ${u?.username} is already taken`);
							}

							return {
								...u,
								isValidPhone: validationRes.isValidPhone,
								isValidEmail: validationRes.isValidEmail,
								isValidUsername: validationRes.isValidUsername,
								hasError: !validationRes.isValidPhone || !validationRes.isValidEmail || !validationRes.isValidUsername,
							};
						})
					);
					setImportingUsers([...validatedItems]);
					setImportErrors(errorsArr);
					setValidationInProgress(false);
				};
				reader.readAsBinaryString(file);
			}
		} catch (e) {
			showSnackBar(`File error: ${(e as Error).message}`);
		}
	};

	const save = async (formData: any) => {
		setFileError(false);
		try {
			if (!importingUsers.length) {
				setFileError(true);
				return;
			}
			setIsSaving(true);

			await userService.import(
				importingUsers
					.filter((u) => typeof u === 'undefined' || u.hasError)
					.map((u) => ({
						...u,
						about: '',
						brandId: formData.brandId,
						roleId: formData.roleId,
					}))
			);

			showSnackBar('Import done!');
			if (onImportDone) onImportDone();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const brandId = watch('brandId');

	const prepareImportingUsersColumns = (importingUsersP: Partial<ImportUserInterface[]>) => {
		if (typeof importingUsersP[0] === 'undefined') return <></>;

		return Object.keys(importingUsersP[0])
			.filter((column: string) => !['isValidPhone', 'isValidEmail', 'isValidUsername', 'hasError'].includes(column))
			.map((column: string, i: number) => (
				<TableCell key={i} className={classes.tableHeaderCell}>
					{column}
				</TableCell>
			));
	};

	const prepareImportingUsers = (importingUsersP: Partial<ImportUserInterface[]>) =>
		importingUsersP.map((obj: any, i1: number) => (
			<TableRow hover role="checkbox" tabIndex={-1} key={i1} className={obj.hasError ? classes.rowError : ''}>
				{Object.keys(obj)
					.filter((key: string) => !['isValidPhone', 'isValidEmail', 'isValidUsername', 'hasError'].includes(key))
					.map((key: any, i: number) => (
						<TableCell key={i}>{String(obj[key])}</TableCell>
					))}
			</TableRow>
		));

	return (
		<Dialog
			fullWidth
			maxWidth={importingUsers.length > 0 ? 'md' : 'xs'}
			open={open}
			onClose={onCancel}
			aria-labelledby="form-dialog-title"
			scroll="body"
		>
			<form onSubmit={handleSubmit(save)} className={classes.form}>
				<DialogTitle id="form-dialog-title">Import users</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={3} className={classes.container}>
						<Grid item xs={12}>
							<Controller
								name="brandId"
								render={({ field }) => (
									<AutocompleteAsync type="brand" label="Brand" {...field} disabled={!isSuperAdmin} filter={{}} />
								)}
								rules={{ required: 'Field is required' }}
								control={control}
							/>
						</Grid>

						<Grid item xs={12}>
							<SelectRoleComponent
								control={control}
								required
								filter={{
									brandId,
									type: BrandRoleType.MEMBER,
								}}
							/>
						</Grid>

						<Grid item xs={6} className={classes.uploadLogoWrap}>
							<Button variant="contained" color="primary" startIcon={<PublishIcon />}>
								<input className={classes.uploadInput} id="new-item-bg" ref={bgRef} type="file" onChange={onUploadFile} />
								<label htmlFor="new-item-bg" style={{ display: 'block', cursor: 'pointer' }}>
									Import file
								</label>
							</Button>
							{fileError && (
								<FormHelperText error style={{ textAlign: 'center', paddingTop: 25, marginTop: 25 }}>
									File must have at least one user
								</FormHelperText>
							)}
						</Grid>

						<Grid item xs={6} className={classes.uploadLogoWrap}>
							<Button
								variant="contained"
								color="primary"
								component={Link}
								download
								target="_blank"
								to="/import_users_example.xlsx"
								startIcon={<GetAppIcon />}
							>
								Example file
							</Button>
						</Grid>
						{validationInProgress && (
							<>
								<LinearProgress style={{ width: '100%' }} />
								<Divider variant="middle" className={classes.middleSpacer} />
							</>
						)}

						{importErrors.length > 0 &&
							importErrors.map((value, k) => (
								<Typography variant="body1" key={k} style={{ color: 'red', width: '100%' }}>
									{value}
								</Typography>
							))}

						{importingUsers.length > 0 && (
							<TableContainer>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>{prepareImportingUsersColumns(importingUsers)}</TableRow>
									</TableHead>
									<TableBody>{prepareImportingUsers(importingUsers)}</TableBody>
								</Table>
							</TableContainer>
						)}

						{Object.keys(errors).length > 0 && (
							<Grid item xs={12}>
								<Typography className={classes.errorText}>You have errors in form. Please fill in all required fields.</Typography>
							</Grid>
						)}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						color="secondary"
						type="button"
						size="large"
						disabled={isSaving || validationInProgress}
						style={{ marginRight: 15 }}
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button variant="contained" color="primary" type="submit" size="large" disabled={isSaving || validationInProgress}>
						Do import
					</Button>
				</DialogActions>
				<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</form>
		</Dialog>
	);
}

export default memo(FormImportUsersComponent);
