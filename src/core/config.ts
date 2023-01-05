import CurrencyInterface from 'dd-common-blocks/dist/interface/custom/currency.interface';

export const PACIFIC_TZ = 'America/Los_Angeles';
export const API_URL = process.env.RAZZLE_RUNTIME_API_URL || '/';
export const NODE_ENV = process.env.RAZZLE_RUNTIME_NODE_ENV || 'production';
export const DEFAULT_SPACES_LIMIT = Number(process.env.DEFAULT_SPACES_LIMIT) || 6;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 48;
export const UNLAYER_PROJECT_ID = process.env.RAZZLE_RUNTIME_UNLAYER_PROJECT_ID;
export const APP_DOMAIN = process.env.RAZZLE_RUNTIME_APP_URL || 'app.drop-desk.com';
export const DEFAULT_BRAND_NAME = process.env.RAZZLE_RUNTIME_DEFAULT_BRAND_NAME || 'DropDesk';
export const SUPPORT_EMAIL = 'support@dropdesk.io';
export const DEFAULT_CURRENCY: CurrencyInterface = {
	symbol: '$',
	name: 'US Dollar',
	symbol_native: '$',
	decimal_digits: 2,
	rounding: 0,
	code: 'USD',
	name_plural: 'US dollars',
};
