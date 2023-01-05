import UserFormValuesInterface from '@forms/interface/user-form-values.interface';
import CCInterface from 'dd-common-blocks/dist/interface/cc.interface';
import UserFilterInterface from 'dd-common-blocks/dist/interface/filter/user-filter.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import { InvoiceItemPaymentType } from 'dd-common-blocks/dist/interface/invoice-item.interface';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import UserPrivatePackageInterface from 'dd-common-blocks/dist/interface/user-private-package.interface';
import BaseService from './base.service';

interface SpaceCreditInterface {
	spaceId: number;
	creditBalance: number;
	creditHours: number;
	billable: number;
}

interface ValidateImportInterface {
	isValidPhone: boolean | null;
	isValidEmail: boolean | null;
	isValidUsername: boolean | null;
}

export default class UserService extends BaseService {
	baseEndpoint = 'user';

	list(params: UserFilterInterface) {
		return super.list<UserInterface, UserFilterInterface>({ withSubscriptions: true, withBrand: true, withPhoto: true, ...params });
	}

	updateProfile(userData: UserInterface, id: number | string | undefined | null): Promise<UserInterface> {
		return super.save<UserInterface>(userData, id);
	}

	save(userData: UserFormValuesInterface, id: number | string | undefined | null) {
		const clonedData = { ...userData };

		if (typeof clonedData.phone !== 'number') clonedData.phone = +clonedData.phone;
		if (clonedData.role) clonedData.role = undefined;
		if (clonedData.brand) clonedData.brand = undefined;

		if (userData.subscriptions) {
			clonedData.subscriptions = userData.subscriptions.map((s) => {
				const clone = s;
				if (id) {
					clone.userId = id;
				}
				// check if it's a new subscription.
				// react-hook-form creates long string ids.
				if (s.id && String(s.id).length > 7) {
					delete clone.id;
				}
				return clone;
			});
		}

		if (id) return super.request({ method: 'put', url: `${this.baseEndpoint}/${id}/update-member`, data: clonedData });
		return super.baseCreate(clonedData);
	}

	// @ts-ignore
	single(id: string | number | undefined) {
		return super.single<UserInterface>(id);
	}

	/**
	 * List user credit cards by user id.
	 * @param id - User ID
	 * @returns CCInterface[]
	 */
	async getCards(id: string | number | undefined): Promise<CCInterface[]> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'get', url: `${this.baseEndpoint}/${id}/cards` });
	}

	/**
	 * List user private packages by user id.
	 * @param id - User ID
	 * @returns UserPrivatePackageInterface[]
	 */
	async getPrivatePackages(id: string | number | undefined): Promise<UserPrivatePackageInterface[]> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'get', url: `${this.baseEndpoint}/${id}/private-packages` });
	}

	/**
	 * List user companies by user id.
	 * @param id - User ID
	 * @returns CompanyInterface[]
	 */
	async getCompanies(id: string | number | undefined): Promise<CompanyInterface[]> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'get', url: `${this.baseEndpoint}/${id}/company` });
	}

	/**
	 * List user available credits by space id
	 * @param userId - User ID
	 * @param spaceIdsArray - Space IDs array
	 * @param creditsToDeduct - credits to deduct
	 * @returns UserPrivatePackageInterface[]
	 */
	async getSpaceCredits(
		userId: string | number | undefined,
		spaceIdsArray: Array<number | string>,
		creditsToDeduct?: number | string | undefined
	): Promise<SpaceCreditInterface[]> {
		if (typeof userId === 'undefined') throw new Error('no user id');

		try {
			return await super.request<SpaceCreditInterface[]>({
				method: 'get',
				url: `${this.baseEndpoint}/${userId}/space-credits`,
				params: { spaceIdsArray, creditsToDeduct },
			});
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	/**
	 * set default user card by user id.
	 * @param {string | number | undefined} userId - User ID
	 * @param {string} cardId - CC ID
	 * @returns CCInterface[]
	 */
	async setDefaultCard(userId: string | number | undefined, cardId: string): Promise<CCInterface[]> {
		if (typeof userId === 'undefined') throw new Error('no id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${userId}/cards/${cardId}/set-default` });
	}

	/**
	 * Change user password
	 * @param {string | number | undefined} userId - User ID
	 * @param {string} newPass - new password
	 * @returns UserInterface
	 */
	async changePassword(userId: string | number | undefined, newPass: string): Promise<UserInterface> {
		if (typeof userId === 'undefined') throw new Error('no id');
		return super.request({ method: 'put', url: `${this.baseEndpoint}/${userId}/change-password`, data: { newPass } });
	}

	/**
	 * delete user card by user id.
	 * @param {string | number | undefined} userId - User ID
	 * @param {string} cardId - CC ID
	 * @returns CCInterface[]
	 */
	async deleteCard(userId: string | number | undefined, cardId: string): Promise<CCInterface[]> {
		if (typeof userId === 'undefined') throw new Error('no id');
		return super.request({ method: 'delete', url: `${this.baseEndpoint}/${userId}/cards/${cardId}` });
	}

	/**
	 * add user card by user id.
	 * @param {string | number | undefined} userId - User ID
	 * @param {CCInterface} data - CC data
	 * @returns CCInterface[]
	 */
	async addCard(userId: string | number | undefined, data: CCInterface): Promise<CCInterface[]> {
		if (typeof userId === 'undefined') throw new Error('no id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${userId}/cards`, data });
	}

	/**
	 * edit user card by user id.
	 * @param {string | number | undefined} userId - User ID
	 * @param {string} cardId - card ID
	 * @param {CCInterface} data - CC data
	 * @returns CCInterface[]
	 */
	async editCard(userId: string | number | undefined, cardId: string, data: CCInterface): Promise<CCInterface[]> {
		if (typeof userId === 'undefined') throw new Error('no id');
		if (typeof cardId === 'undefined') throw new Error('no cc id');
		return super.request({ method: 'put', url: `${this.baseEndpoint}/${userId}/cards/${cardId}`, data });
	}

	async suspend(id: number | string | undefined): Promise<void> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'put', url: `${this.baseEndpoint}/${id}/suspend` });
	}

	async moveOut(
		id: number | string | undefined,
		data?: { manualAmount?: number; returnType?: InvoiceItemPaymentType; returnNote?: string }
	): Promise<void> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${id}/move-out`, data });
	}

	async activate(id: number | string | undefined): Promise<void> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${id}/activate` });
	}

	async checkins(id: number | string | undefined): Promise<ReservationInterface[]> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'get', url: `${this.baseEndpoint}/${id}/check-ins` });
	}

	async delete(id: number | string | undefined): Promise<void> {
		if (typeof id === 'undefined') throw new Error('no id');
		return super.request({ method: 'delete', url: `${this.baseEndpoint}/${id}` });
	}

	async import(
		data: (
			| undefined
			| { firstname: string; phone: number; roleId: any; brandId: any; about: string; email: string; username: string; lastname: string }
		)[]
	): Promise<void> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/import`, data: { users: data } });
	}

	async validateImport(data: { username: string; phone: string; email: string }): Promise<ValidateImportInterface> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/validate-import`, data });
	}

	async invite(data: { brandId: string; teamId?: string; emails: string[] }) {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/invite`, data });
	}
}
