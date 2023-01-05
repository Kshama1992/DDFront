import React, { useContext, useEffect, useState } from 'react';
import { Dialog, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import NumberFormat from 'react-number-format';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CCInterface from 'dd-common-blocks/dist/interface/cc.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import UserService from '@service/user.service';
import LoadingButton from '@forms/elements/loading-button.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: 15,
			overflow: 'hidden',
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
		title: {
			color: theme.palette.primary.main,
			textAlign: 'center',
			fontWeight: 500,
			position: 'relative',
		},
		closeBtn: {
			position: 'absolute',
			top: -10,
			right: -15,
		},
		lockIcon: {
			color: theme.palette.primary.main,
			fontSize: 12,
			marginBottom: -2,
		},
		safeText: {
			fontSize: 12,
		},
		poweredImage: {
			margin: '10px auto 25px auto',
			width: 150,
			display: 'block',
		},
	})
);

const defaultCC = {
	name: '',
	cvc: '',
	zip: '',
	exp_month: '',
	exp_year: '',
	number: '',
	last4: `**** **** **** 0000`,
	address_zip: '',
};

export default function AddCCComponent({
	open,
	onClose,
	onAdded,
	userId,
	initialValues,
}: {
	open: boolean;
	onClose?: () => void;
	onAdded: (cc: CCInterface) => void;
	userId: string;
	initialValues?: CCInterface;
}) {
	const classes = useStyles({});

	const userService = new UserService();
	const { showSnackBar } = useContext(SnackBarContext);

	const handleClose = () => {
		if (typeof onClose !== 'undefined') {
			onClose();
		}
	};

	const initialCC = {
		name: initialValues?.name || '',
		cvc: '',
		zip: initialValues?.address_zip || '',
		exp_month: '',
		exp_year: '',
		exp: `${initialValues?.exp_month || 'MM'}/${String(initialValues?.exp_year || 'YY').substring(2)}`,
		number: `**** **** **** ${initialValues?.last4 || '0000'}`,
		last4: `**** **** **** ${initialValues?.last4 || '000'}`,
		address_zip: '',
	};

	const [isLoading, setIsLoading] = useState(false);

	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm<CCInterface>({
		defaultValues: typeof initialValues !== 'undefined' ? initialCC : defaultCC,
	});

	useEffect(() => {
		reset(typeof initialValues !== 'undefined' ? initialCC : defaultCC);
	}, [initialValues]);

	const onSubmit = async (formData: CCInterface) => {
		const { name, number, zip, cvc, exp } = formData;

		if (!exp || exp === 'MM/YY') {
			showSnackBar('Please enter a valid expiration date');
			return;
		}

		const monthVal = exp.split('/')[0];

		if (parseInt(monthVal, 10) === 0 || parseInt(monthVal, 10) > 12 || monthVal === 'MM' || monthVal.match(/[a-z]/i) !== null) {
			showSnackBar('Please enter a valid expiration month');
		} else {
			setIsLoading(true);

			const cardData = {
				name,
				exp_year: exp.split('/')[1],
				exp_month: exp.split('/')[0],
				address_zip: zip || '',
				number,
				cvc,
			};

			try {
				if (initialValues && initialValues.id) {
					await userService.editCard(userId, initialValues.id as string, { ...cardData });
				} else {
					await userService.addCard(userId, cardData);
				}
				onAdded(cardData);
			} catch (e) {
				showSnackBar((e as Error).message);
				throw e;
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="xs">
			<DialogContent>
				<DialogContentText className={classes.title}>
					{typeof initialValues !== 'undefined' ? 'Edit' : 'Add new'} card
					<IconButton aria-label="close" className={classes.closeBtn} onClick={handleClose} size="large">
						<CloseIcon />
					</IconButton>
				</DialogContentText>

				<Grid container spacing={3} style={{ padding: 15, overflow: 'hidden' }}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={3} className={classes.root}>
							<Grid item xs={12}>
								<Controller
									render={({ field }) => (
										<TextField
											InputLabelProps={{ shrink: true }}
											error={!!errors.name}
											fullWidth
											variant="standard"
											helperText={errors.name ? errors.name.message : ''}
											label="Cardholder Name"
											{...field}
										/>
									)}
									rules={{ required: 'Field is required' }}
									name="name"
									control={control}
								/>
							</Grid>

							<Grid item xs={12}>
								{typeof initialValues !== 'undefined' && (
									<Controller
										render={({ field }) => (
											<TextField
												InputLabelProps={{ shrink: true }}
												margin="dense"
												label="Card number"
												fullWidth
												variant="standard"
												disabled
												{...field}
											/>
										)}
										name="last4"
										control={control}
									/>
								)}

								{typeof initialValues === 'undefined' && (
									<Controller
										render={({ field }) => (
											// @ts-ignore
											<NumberFormat
												InputLabelProps={{ shrink: true }}
												fullWidth
												allowEmptyFormatting
												label="Card number"
												variant="standard"
												customInput={TextField}
												helperText={errors.number ? errors.number.message : ''}
												error={!!errors.number}
												format="#### #### #### ####"
												placeholder="1234 5678 1234 5678"
												mask=" "
												{...field}
											/>
										)}
										name="number"
										rules={{ required: 'Field is required' }}
										control={control}
									/>
								)}
							</Grid>

							<Grid item sm={4} xs={12}>
								<Controller
									render={({ field }) => (
										// @ts-ignore
										<NumberFormat
											InputLabelProps={{ shrink: true }}
											margin="dense"
											error={!!errors.exp}
											variant="standard"
											allowEmptyFormatting
											helperText={errors.exp ? errors.exp.message : ''}
											customInput={TextField}
											label="Exp"
											format="##/##"
											placeholder="MM/YY"
											mask={['M', 'M', 'Y', 'Y']}
											{...field}
										/>
									)}
									name="exp"
									rules={{ required: 'Field is required' }}
									control={control}
								/>
							</Grid>

							<Grid item sm={4} xs={12}>
								<Controller
									render={({ field }) => (
										<TextField
											InputLabelProps={{ shrink: true }}
											error={!!errors.cvc}
											margin="dense"
											variant="standard"
											helperText={errors.cvc ? errors.cvc.message : ''}
											disabled={typeof initialValues !== 'undefined'}
											label="CVC"
											{...field}
										/>
									)}
									name="cvc"
									rules={{ required: initialValues ? false : 'Field is required' }}
									control={control}
								/>
							</Grid>

							<Grid item sm={4} xs={12}>
								<Controller
									render={({ field }) => (
										<TextField
											InputLabelProps={{ shrink: true }}
											error={!!errors.zip}
											margin="dense"
											variant="standard"
											helperText={errors.zip ? errors.zip.message : ''}
											label="ZIP"
											{...field}
										/>
									)}
									name="zip"
									rules={{ required: 'Field is required' }}
									control={control}
								/>
							</Grid>

							<Grid item xs={12}>
								<LoadingButton
									size="large"
									type="submit"
									variant="contained"
									color="primary"
									fullWidth
									isLoading={isLoading}
									endIcon={typeof initialValues !== 'undefined' ? <SaveIcon /> : <AddIcon />}
									text={`${typeof initialValues !== 'undefined' ? 'Save' : 'Add new'} card`}
								/>
							</Grid>
						</Grid>
					</form>

					<Grid item xs={12}>
						<Typography component="small" variant="caption" className={classes.safeText}>
							<LockIcon className={classes.lockIcon} /> Your personal information is kept safe and secure
						</Typography>

						<img className={classes.poweredImage} src="/images/powered_by_stripe.svg" alt="Powered by stripe" />
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}
