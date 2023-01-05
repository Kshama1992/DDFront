import React, { useContext, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import AuthService, { SignUpInterface } from '@service/auth.service';
import TeamService from '@service/team.service';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@core/config';
import FormSignInStyles from '@forms/styles/form-sign-in.styles';

interface SignUpFormInputs extends SignUpInterface {
	tos?: boolean;
}

export default function FormSignUpComponent({ onSuccess, phoneNumber }: { phoneNumber: string; onSuccess: (userData: UserInterface) => void }) {
	const classes = FormSignInStyles({});
	const authService = new AuthService();
	const searchParams = parseQueryHelper(window.location.search);
	const isTeamLead = !!searchParams.teamLead;
	const { spaceId } = searchParams;
	const { teamId } = searchParams;

	const { currentBrand } = useContext(AuthContext);

	const { showSnackBar } = useContext(SnackBarContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormInputs>();

	const [company, setCompany] = useState<CompanyInterface | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const getTeam = useCallback(async () => {
		if (!teamId) return;
		try {
			const teamService = new TeamService();
			const data = await teamService.single(teamId);

			if (data && data.companies && data.companies.length) {
				setCompany(data.companies[0]);
			}
		} catch (e) {
			console.error(e);
		}
	}, [teamId]);

	useEffect(() => {
		getTeam().then();
	}, [teamId, getTeam]);

	const onSubmit = async (formData: any) => {
		try {
			setIsLoading(true);
			const sendData = { ...formData, phone: Number(phoneNumber), brandId: currentBrand?.id };
			if (spaceId) sendData.spaceId = spaceId;
			if (teamId) sendData.teamId = teamId;
			if (company) sendData.companyId = company.id;

			const { userData } = await authService.signUp(sendData);
			onSuccess(userData);
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailValidation = async (email: any) => {
		const { valid: isValid } = await authService.validateEmail({ email });
		if (!isValid) return "Invalid email or doesn't exist";
		const { exist } = await authService.checkExist({ email });
		return exist ? 'Email already registered!' : true;
	};

	const handleUsernameExist = async (username: any) => {
		const { exist } = await authService.checkExist({ username });
		return exist ? 'Username already registered!' : true;
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							InputLabelProps={{ shrink: true }}
							error={!!errors.firstname}
							label="First Name"
							variant="outlined"
							helperText={errors.firstname ? errors.firstname.message : ''}
							{...register('firstname', {
								required: 'Field is required',
								minLength: { value: 2, message: 'Min First Name length 3' },
							})}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							InputLabelProps={{ shrink: true }}
							error={!!errors.lastname}
							label="Last Name"
							variant="outlined"
							helperText={errors.lastname ? errors.lastname.message : ''}
							{...register('lastname', {
								required: 'Field is required',
								minLength: { value: 2, message: 'Min Last Name length 3' },
							})}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							InputLabelProps={{ shrink: true }}
							error={!!errors.email}
							label="Email"
							variant="outlined"
							helperText={errors.email ? errors.email.message : ''}
							{...register('email', { validate: handleEmailValidation, required: 'Field is required' })}
						/>
					</Grid>

					{teamId && company && (
						<Grid item xs={12} sm={6}>
							<TextField fullWidth label="Company" variant="outlined" value={company.name} disabled />
						</Grid>
					)}

					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							InputLabelProps={{ shrink: true }}
							error={!!errors.username}
							label="Choose a Username"
							variant="outlined"
							helperText={errors.username ? errors.username.message : ''}
							{...register('username', {
								required: 'Field is required',
								validate: handleUsernameExist,
								minLength: { value: 6, message: 'Min Username length 3' },
							})}
						/>
					</Grid>

					{isTeamLead && (
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								InputLabelProps={{ shrink: true }}
								error={!!errors.teamName}
								label="Choose name for your team"
								variant="outlined"
								helperText={errors.teamName ? errors.teamName.message : ''}
								{...register('teamName', {
									required: 'Field is required',
									minLength: { value: 3, message: 'Min Team name length 3' },
								})}
							/>
						</Grid>
					)}

					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							type="password"
							InputLabelProps={{ shrink: true }}
							error={!!errors.password}
							label="Choose a Password"
							variant="outlined"
							helperText={errors.password ? errors.password.message : ''}
							{...register('password', {
								required: 'Field is required',
								minLength: { value: PASSWORD_MIN_LENGTH, message: 'Min password length 6' },
								maxLength: { value: PASSWORD_MAX_LENGTH, message: 'Max password length 48' },
							})}
						/>
					</Grid>

					<Grid item xs={12} style={{ padding: '15px 0 10px 25px', textAlign: 'center' }}>
						<FormControlLabel
							control={
								<Checkbox
									color="primary"
									{...register('tos', {
										required: 'You must accept the Terms, Community Guidelines and Privacy Policy',
									})}
								/>
							}
							label={
								<FormHelperText>
									I accept the DropDesk LLC{' '}
									<a target="_blank" href="https://drop-desk.com/termsandconditions" rel="noreferrer">
										Terms and Conditions
									</a>{' '}
									and{' '}
									<a target="_blank" href="https://drop-desk.com/privacypolicy" rel="noreferrer">
										Privacy Policy
									</a>
								</FormHelperText>
							}
						/>
						{errors.tos && <FormHelperText error>{errors.tos.message}</FormHelperText>}
					</Grid>

					<Grid item xs={12} style={{ padding: 0, textAlign: 'center' }}>
						<div className={classes.brnWrapper}>
							<Button disabled={isLoading} className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn} type="submit">
								Create User
							</Button>
							{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
						</div>
					</Grid>
				</Grid>
			</form>
		</>
	);
}
