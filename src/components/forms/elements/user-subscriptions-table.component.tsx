import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import LinearProgress from '@mui/material/LinearProgress';
import TableBody from '@mui/material/TableBody';
import dayjs, { extend } from 'dayjs';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import SubFormValues from '@forms/interface/sub-form.interface';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ConfirmDialog from '@shared-components/confirm.dialog';
import SubscriptionService from '@service/subscription.service';
import { capitalize } from '@mui/material';
import SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';

extend(customParseFormat);

interface UserSubscriptionsTableProps {
	subscriptions: SubFormValues[];
	onCancel?: () => any;
	onEditBtnClick?: (editSub: SubFormValues) => any;
	isInputLoading?: boolean;
}

const FormMemberStyles = makeStyles((theme: Theme) =>
	createStyles({
		subContainer: {
			padding: 35,
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
	})
);

export default function UserSubscriptionsTableComponent({
	subscriptions,
	onCancel,
	onEditBtnClick,
	isInputLoading = false,
}: UserSubscriptionsTableProps) {
	const classes = FormMemberStyles({});
	const subscriptionService = new SubscriptionService();
	const [cancelingSub, setCancelingSub] = useState<SubFormValues | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(isInputLoading);
	const [subscriptionCancelVisible, setSubscriptionCancelVisible] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(isInputLoading);
	}, [isInputLoading]);

	const handleSubCancel = (editSub: SubFormValues) => {
		setCancelingSub(editSub);
		setSubscriptionCancelVisible(true);
	};

	const handleSubscriptionCancel = async () => {
		setIsLoading(true);
		await subscriptionService.delete(cancelingSub.id);
		setCancelingSub(undefined);
		setSubscriptionCancelVisible(false);
		setIsLoading(false);
		if (onCancel) onCancel();
	};

	return (
		<>
			<Grid container spacing={1} className={classes.subContainer}>
				<Grid item xs={12}>
					{isLoading && <LinearProgress />}
					{subscriptions.length === 0 && <Typography>No subscriptions</Typography>}

					{subscriptions.length > 0 && (
						<TableContainer component={Paper}>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="right">Amount</TableCell>
										<TableCell align="right">Charge Type</TableCell>
										<TableCell align="right">Start Date</TableCell>
										<TableCell align="right">End Date</TableCell>
										<TableCell align="right">Is Ongoing</TableCell>
										<TableCell align="right">Status</TableCell>
										<TableCell align="right" />
									</TableRow>
								</TableHead>
								<TableBody>
									{subscriptions.map((sub, index: number) => (
										<TableRow key={index}>
											<TableCell component="th" scope="row">
												{sub.name || sub.space?.name}
											</TableCell>
											<TableCell align="right">{sub.spaceAmount}</TableCell>
											<TableCell align="right">{sub.space?.chargeType}</TableCell>
											<TableCell align="right">{dayjs(sub.startDate as string).format('D MMMM YYYY')}</TableCell>
											<TableCell align="right">{dayjs(sub.endDate as string).format('D MMMM YYYY')}</TableCell>
											<TableCell align="right">{sub.isOngoing ? <CheckIcon /> : <CloseIcon />}</TableCell>
											<TableCell align="right">{capitalize(sub.status)}</TableCell>
											<TableCell align="right">
												{![SubscriptionStatus.CANCELED, SubscriptionStatus.DELETED].includes(sub.status) && (
													<IconButton
														aria-label="edit"
														color="primary"
														onClick={() => onEditBtnClick(sub)}
														size="large"
														disabled={isLoading}
													>
														<EditIcon fontSize="small" />
													</IconButton>
												)}
												{![SubscriptionStatus.CANCELED, SubscriptionStatus.DELETED].includes(sub.status) && (
													<IconButton
														aria-label="cancel"
														color="secondary"
														onClick={() => handleSubCancel(sub)}
														size="large"
														disabled={isLoading}
													>
														<DoDisturbIcon fontSize="small" />
													</IconButton>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Grid>
			</Grid>

			<ConfirmDialog
				actionText="Cancel subscription"
				text={`Are you sure you want to cancel ${cancelingSub?.name}?`}
				open={subscriptionCancelVisible}
				isLoading={isLoading}
				onClose={() => setSubscriptionCancelVisible(false)}
				action={handleSubscriptionCancel}
			/>
		</>
	);
}
