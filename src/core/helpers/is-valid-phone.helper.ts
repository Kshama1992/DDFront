import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

export default function isValidPhone(number: string, country: string): string | boolean {
	if (!number) return false;

	if (number.length < 5) return 'Phone number is too short';
	let error: string | boolean = false;

	const phoneNumber = parsePhoneNumberFromString(`+${number}`, country as CountryCode);

	if (!phoneNumber || !phoneNumber.isValid()) error = 'Wrong phone number';

	return error;
}
