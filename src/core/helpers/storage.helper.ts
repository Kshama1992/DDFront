import dayjs from 'dayjs';
import { Cookies } from 'react-cookie';
import { APP_DOMAIN } from '../config';

interface CookieSetOptions {
	path?: string;
	expires?: Date;
	maxAge?: number;
	domain?: string;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: boolean | 'none' | 'lax' | 'strict';
	encode?: (value: string) => string;
}

const getParams = (domain?: string | undefined): CookieSetOptions => {
	const opts: CookieSetOptions = {
		domain: domain || ``,
		path: '/',
		secure: true,
		sameSite: 'strict',
		expires: dayjs().add(1, 'week').toDate(),
	};

	if (!APP_DOMAIN.includes('localhost')) {
		opts.secure = true;
		opts.domain = domain || `.${APP_DOMAIN}`;
	}

	return opts;
};

export { getParams };

export function getLocalStorage(name: string): any | undefined {
	const res = (localStorage || window.localStorage).getItem(name);
	if (res === null) return undefined;

	try {
		return JSON.parse(String(res));
	} catch (e) {
		return res;
	}
}

export function getSessionStorage(name: string): any | undefined {
	const res = window.sessionStorage.getItem(name);
	if (res === null) return undefined;

	try {
		return JSON.parse(String(res));
	} catch (e) {
		return res;
	}
}

export function deleteLocalStorage(name: string) {
	return (localStorage || window.localStorage).removeItem(name);
}

export function deleteSessionStorage(name: string) {
	return window.sessionStorage.removeItem(name);
}

export function setLocalStorage(name: string, value: any) {
	return (localStorage || window.localStorage).setItem(name, value);
}

export function setSessionStorage(name: string, value: any) {
	return window.sessionStorage.setItem(name, value);
}

export function getCookie(name: string): any | undefined {
	const cookiesIns = new Cookies();
	try {
		return JSON.parse(cookiesIns.get(name));
	} catch (e) {
		return cookiesIns.get(name);
	}
}

export function deleteCookie(name: string) {
	const cookiesIns = new Cookies();
	return cookiesIns.remove(name, getParams());
}

export function setCookie(name: string, value: any) {
	const cookiesIns = new Cookies();
	return cookiesIns.set(name, value, getParams());
}
