import { parsePhoneNumber } from 'libphonenumber-js';

export default function formatPhone(phone: string, asUrl = false): string | boolean {
	if (!phone) return '';

	const phoneNumber = parsePhoneNumber(`+${phone}`);

	if (!phoneNumber) return String(phone);
	const phoneNumberString = phoneNumber.formatInternational();
	if (asUrl) {
		const phoneNumberUrlString = phoneNumber.getURI();
		return `<a href="${phoneNumberUrlString}" title="Click to call ${phoneNumberString}">${phoneNumberString}</a>`;
	}
	return phoneNumberString;
}
