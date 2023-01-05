import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import LoadingButton from '@forms/elements/loading-button.component';
import SpacePriceComponent from '@shared-components/space-price.component';
import ConfirmCheckInStyle from './style/confirm-check-in.style';

export default function ConfirmCheckoutDialog({
	onOk,
	onCancel,
	open,
	isLoading,
	space,
	isTeamMembershipCheckout = false,
}: {
	open: boolean;
	onOk: (teamName?: string) => void;
	onCancel: () => void;
	isLoading?: boolean;
	space: SpaceInterface;
	isTeamMembershipCheckout?: boolean;
}) {
	const classes = ConfirmCheckInStyle();
	const handleDialogClose = () => onCancel();

	const [teamName, setTeamName] = useState<string | undefined>();

	const handleConfirm = () => {
		if (onOk) onOk(teamName);
	};

	return (
		<Dialog open={open} onClose={handleDialogClose} maxWidth="xs">
			<IconButton onClick={handleDialogClose} className={classes.backButton} size="large">
				<CloseIcon />
			</IconButton>

			<Typography className={classes.heading}>Checkout confirmation</Typography>

			{isTeamMembershipCheckout && space.packageShow === PackageShow.TEAM_MEMBERSHIP && (
				<Grid item xs={12}>
					<TextField onChange={(e) => setTeamName(e.target.value)} label="Select name for team" />
				</Grid>
			)}

			{space.chargeType !== ChargeType.FREE && (
				<>
					{space.spaceType.logicType === SpaceTypeLogicType.HOURLY && (
						<Typography className={classes.text}>
							<span>*</span>Once you click confirm, your credits will be used, or your card will be charged.
						</Typography>
					)}

					{[SpaceTypeLogicType.HOURLY, SpaceTypeLogicType.MINUTELY].includes(space.spaceType.logicType) && (
						<Typography className={classes.text}>
							<br />
							<b>
								You will be billed <SpacePriceComponent space={space} className={classes.priceBold} />, for a minimum of{' '}
								{space.roundHours} hours
							</b>
						</Typography>
					)}

					{![SpaceTypeLogicType.HOURLY, SpaceTypeLogicType.MINUTELY].includes(space.spaceType.logicType) && (
						<Typography className={classes.text}>
							Once you click confirm, your card will be charged for <SpacePriceComponent space={space} className={classes.priceBold} />
						</Typography>
					)}
				</>
			)}

			{space.chargeType === ChargeType.FREE && space.spaceType.logicType !== SpaceTypeLogicType.MONTHLY && (
				<Typography className={classes.text}>Click confirm to book this free package</Typography>
			)}

			<Grid container>
				<Grid item xs={6} className={classes.btnWrp}>
					<LoadingButton
						onClick={handleConfirm}
						text="Confirm"
						size="large"
						className={classes.btn}
						isLoading={isLoading}
						disabled={isTeamMembershipCheckout && space.packageShow === PackageShow.TEAM_MEMBERSHIP && teamName === ''}
					/>
				</Grid>
				<Grid item xs={6} className={classes.btnWrp}>
					<Button onClick={onCancel} className={classes.btnBlack} variant="contained">
						Cancel
					</Button>
				</Grid>
			</Grid>
		</Dialog>
	);
}
