import React, { memo } from 'react';
import Typography from '@mui/material/Typography';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import { DEFAULT_CURRENCY } from '@core/config';
import { getCurrencySymbol } from 'dd-common-blocks';

/**
 * Space price without tax
 * @param {SpaceInterface} space
 * @param {string | undefined} className
 * @returns {JSX.Element}
 * @constructor
 */
function SpacePriceComponent({ space, className }: { className?: any; space: SpaceInterface }) {
	if (space.chargeType === ChargeType.FREE)
		return (
			<Typography color="textSecondary" className={className}>
				Free
			</Typography>
		);

	const spaceCurrency = typeof space.venue.currency === 'undefined' ? DEFAULT_CURRENCY.code : space.venue.currency;

	const spacePrice = space.price;
	const price = `${getCurrencySymbol(spaceCurrency)} ${spacePrice.toFixed(2)}`;

	let priceText = price;

	if ([ChargeType.HOURLY].indexOf(space.chargeType) > -1) priceText = `${price}/hr.`;

	if ([ChargeType.MONTHLY, ChargeType.PRORATE_1, ChargeType.PRORATE].indexOf(space.chargeType) > -1) priceText = `${price}/m.`;

	if (['Daypass'].indexOf(space.spaceType.name) > -1) priceText = `${price}/d.`;

	if (['Weekpass'].indexOf(space.spaceType.name) > -1) priceText = `${price}/wk.`;

	if (['DedicatedDesk', 'Monthly'].indexOf(space.spaceType.name) > -1) priceText = `${price}/m.`;

	return <Typography component="b" color="textSecondary" className={className} dangerouslySetInnerHTML={{ __html: String(priceText) }} />;
}

export default memo(SpacePriceComponent);
