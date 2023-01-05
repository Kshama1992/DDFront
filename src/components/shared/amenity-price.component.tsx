import React, { memo } from 'react';
import Typography from '@mui/material/Typography';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';
import { DEFAULT_CURRENCY } from '@core/config';
import { getCurrencySymbol } from 'dd-common-blocks';

function AmenityPriceComponent({ amenity, className, currency }: { className?: string; amenity: SpaceAmenityInterface; currency?: string }) {
	if (amenity.chargeType === ChargeType.FREE)
		return (
			<Typography color="textSecondary" className={className}>
				Free
			</Typography>
		);

	const spaceCurrency = typeof currency === 'undefined' ? DEFAULT_CURRENCY.code : currency;

	const amenityPrice = amenity.price;

	const price = `${getCurrencySymbol(spaceCurrency)} ${amenityPrice.toFixed(2)}`;

	let priceText = price;

	if ([ChargeType.HOURLY].indexOf(amenity.chargeType) > -1) priceText = `${price}/hr.`;

	if ([ChargeType.MONTHLY].indexOf(amenity.chargeType) > -1) priceText = `${price}/m.`;

	return <Typography color="textSecondary" className={className} dangerouslySetInnerHTML={{ __html: String(priceText) }} />;
}

export default memo(AmenityPriceComponent);
