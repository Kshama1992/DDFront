export default function CCAvatar(ccName: string) {
	let url = '/cc/default.svg';

	switch (ccName) {
		case 'Visa':
			url = '/cc/visa.svg';
			break;
		case 'American Express':
			url = '/cc/amex.svg';
			break;
		case 'Diners Club':
			url = '/cc/diners.svg';
			break;
		case 'Discover':
			url = '/cc/discover.svg';
			break;
		case 'JCB':
			url = '/cc/jcb.svg';
			break;
		case 'MasterCard':
			url = '/cc/mastercard.svg';
			break;
		case 'UnionPay':
			url = '/cc/unionpay.svg';
			break;
		case 'Unknown':
		default:
			url = '/cc/default.svg';
			break;
	}

	return url;
}
