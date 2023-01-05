import React from 'react';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import { useTheme, Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import InvoiceItemInterface from 'dd-common-blocks/dist/interface/invoice-item.interface';
import Typography from '@mui/material/Typography';
import { SecondsToTimeHelper } from 'dd-common-blocks';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		textPrimary: {
			fontSize: 15,
			paddingTop: 5,
			textDecoration: 'none',
		},
		textPrimaryLaptop: {
			fontSize: 15,
			textDecoration: 'none',
		},
		mobileText: {
			display: 'none',
			color: '#333',
			fontWeight: 500,
			[theme.breakpoints.down('md')]: {
				display: 'block',
			},
		},
	})
);

export default function CreditsLineComponent({
	invoiceSpaceLine,
	reservation,
	spaceType,
}: {
	spaceType: SpaceTypeInterface | undefined;
	reservation: Partial<ReservationInterface> | undefined;
	invoiceSpaceLine: Partial<InvoiceItemInterface> | undefined;
}) {
	const classes = useStyles({});
	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	if (!reservation || !spaceType) return <></>;

	if (invoiceSpaceLine && spaceType.logicType && [SpaceTypeLogicType.MINUTELY, SpaceTypeLogicType.HOURLY].includes(spaceType.logicType)) {
		return (
			<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
				<b className={classes.mobileText}>Credit hours: </b>
				<span
					dangerouslySetInnerHTML={{
						__html: `${SecondsToTimeHelper(invoiceSpaceLine.creditHours ? invoiceSpaceLine.creditHours * 60 * 60 : 0)}`,
					}}
				/>
			</Typography>
		);
	}
	return <></>;
}
