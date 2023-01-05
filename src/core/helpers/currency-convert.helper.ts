import { getCurrencySymbol } from 'dd-common-blocks';
import { DEFAULT_CURRENCY } from '../config';

/**
 * Convert currency
 * @param venueCurrency venue currency
 * @param price number
 * @param fraction number
 * @param userCurrency  user currency
 * @param asString fancy formatting and return as string. default false
 * @returns {Promise<number|string>}
 */
export default function convertCurrency(
	price: any,
	userCurrency?: string | undefined,
	venueCurrency: string = DEFAULT_CURRENCY.code,
	asString = false,
	fraction = 2
) {
	const returnValue = Number.isNaN(price) ? 0 : price;
	// const cachedKey = `currencyRates_${userCurrency || 'USD'}`;

	// if (venueCurrency === userCurrency) {
	// 	returnValue = Number.isNaN(price) ? 0 : price;
	// } else {
	// 	const cachedRates: any | undefined = getCookie(cachedKey);
	//
	// 	if (typeof cachedRates !== 'undefined') {
	// 		const ratesObject = cachedRates;
	// 		if (typeof ratesObject.rates === 'undefined') {
	// 			returnValue = price;
	// 		} else {
	// 			const toRate = ratesObject.rates[venueCurrency];
	// 			const money = price / toRate;
	// 			returnValue = Number.isNaN(money) ? 0 : money;
	// 		}
	// 	} else {
	// 		returnValue = price;
	// 	}
	// }

	return asString ? `${getCurrencySymbol(venueCurrency || 'USD')} ${!returnValue ? returnValue : returnValue.toFixed(fraction)}` : returnValue;
}
