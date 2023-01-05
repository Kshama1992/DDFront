import dayjs, { extend, unix } from 'dayjs';
import dayjsutc from 'dayjs/plugin/utc';
import BaseService from '@service/base.service';
import { getCookie, setCookie } from './storage.helper';

extend(dayjsutc);

/**
 * Simple fetch currency exchange rates
 * @param code
 * @returns {Promise<null|any>}
 */
const fetchRatesForCurrency = async (code: string) => {
	const baseService = new BaseService();
	try {
		return await baseService.getCurrencyRates(code);
	} catch (e) {
		console.error(e);
		return null;
	}
};

/**
 * Fetch and cache currency rates
 * @param currencyCode e.g. USD
 * @returns {Promise<{}>}
 */
export default async function getCurrencyRates(currencyCode: string) {
	const cachedKey = `currencyRates_${currencyCode}`;
	try {
		let cachedRates = await getCookie(cachedKey);
		if (typeof cachedRates === 'undefined') {
			const json: any = await fetchRatesForCurrency(currencyCode);
			const { rates } = json;
			await setCookie(cachedKey, { timestamp: dayjs().valueOf(), rates });
			cachedRates = rates;
		} else {
			const tempJson = cachedRates;
			const a = dayjs();
			const b = unix(tempJson.timestamp);
			const diff = a.diff(b, 'd');
			if (diff >= 1) {
				/**
				 * if passed time is more than 1 day we need to update rates
				 */
				const json: any = await fetchRatesForCurrency(currencyCode);
				const { rates } = json;
				await setCookie(cachedKey, { timestamp: dayjs().valueOf(), rates });
				cachedRates = rates;
			} else {
				cachedRates = tempJson.rates;
			}
		}
		return cachedRates;
	} catch (e) {
		console.error(e);
		return {};
	}
}
