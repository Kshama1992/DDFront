import { axios } from '@core/api';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import { deleteCookie, deleteLocalStorage, getCookie, getLocalStorage, setLocalStorage } from './storage.helper';

export const getUserDataHelper = (): UserInterface | undefined => {
	try {
		return getLocalStorage('authBody');
	} catch (e) {
		return undefined;
	}
};
export const setUserDataHelper = (userData: UserInterface | undefined) => userData && setLocalStorage('authBody', JSON.stringify(userData));
export const delUserDataHelper = () => deleteLocalStorage('authBody');

export const getIsAuthenticatedHelper = () => {
	try {
		return typeof getUserDataHelper() !== 'undefined';
	} catch (e) {
		return false;
	}
};

export const getCookieUserHelper = (): { id: number | string } | undefined => getCookie('u');

export const setBrandDataHelper = (brand: BrandInterface | undefined) => brand && setLocalStorage('brand', JSON.stringify(brand));

export const resetAuthHelper = async () =>
	axios.post('auth/log-out').then(() => {
		delUserDataHelper();
		deleteCookie('u');
	});
