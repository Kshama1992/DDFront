import { AxiosRequestConfig } from 'axios';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseInterface from 'dd-common-blocks/dist/interface/base.interface';
import { axios } from '../api';
import { API_URL } from '../config';

export default class BaseService {
	baseEndpoint = '';

	/**
	 * Base request
	 * @param opts
	 */
	// eslint-disable-next-line class-methods-use-this
	request<T>(opts: AxiosRequestConfig): Promise<T> {
		try {
			return axios.request({
				baseURL: API_URL,
				transformResponse: (r: string) => {
					try {
						return JSON.parse(r).data;
					} catch (e) {
						console.error({ e, r });
						return r;
					}
				},
				...opts,
			});
		} catch (e) {
			console.error(e);
			throw BaseService.handleError(e);
		}
	}

	/**
	 * Handle all errors from API
	 * @param e
	 */
	static handleError(e: any) {
		let errorMsg = e.message;

		if (e.response && e.response.data?.message) {
			errorMsg = e.response.data.message;
		}

		if (e.response?.data?.data?.length) {
			e.response.data.data.forEach(({ msg, param }: { msg: string; param: string }) => {
				errorMsg += `. ${msg}. (${param})`;
			});
		}

		e.message = errorMsg;
		return e;
	}

	/**
	 * Update single item
	 * @param id
	 * @param data
	 */
	async baseSave<T>(id: string | number | undefined, data: Partial<T>): Promise<T> {
		if (typeof id === 'undefined') throw new Error('no id');
		return this.request<T>({
			method: 'put',
			url: `${this.baseEndpoint}/${id}`,
			data,
		});
	}

	/**
	 * Create single item
	 * @param data
	 */
	async baseCreate<T>(data: Partial<T>): Promise<T> {
		return this.request<T>({ method: 'post', url: `${this.baseEndpoint}`, data });
	}

	/**
	 * Get single item
	 * @param id
	 * @param opts
	 */
	single<T>(id: string | number | undefined, opts?: AxiosRequestConfig): Promise<T> {
		if (typeof id === 'undefined') throw new Error('no id');
		return this.request<T>({
			method: 'get',
			url: `${this.baseEndpoint}/${id}`,
			...opts,
		});
	}

	/**
	 * Get items list
	 * @param params
	 */
	async list<T, U extends BaseListFilterInterface>(params?: U | undefined): Promise<[T[], number]> {
		return this.request<[T[], number]>({
			method: 'get',
			url: this.baseEndpoint,
			params,
			transformResponse: (r: string) => {
				try {
					const resp = JSON.parse(r);
					return [resp.data, resp.total];
				} catch (e) {
					return r;
				}
			},
		});
	}

	/**
	 * Save or create single item
	 * @param data
	 * @param id
	 */
	async save<T>(data: T, id?: number | string | undefined | null): Promise<T> {
		const clone = { ...data };
		// null values clean up
		Object.keys(clone).forEach((key): void => {
			// @ts-ignore
			if (clone[key] === null) delete clone[key];
		});

		if (id && id !== '0') {
			return this.baseSave(id, clone);
		}
		return this.baseCreate(clone);
	}

	/**
	 * Delete single item
	 * @param id
	 */
	delete<T extends BaseInterface>(id: string | number | undefined): Promise<T> {
		if (typeof id === 'undefined') throw new Error('no id');
		return this.request<T>({ method: 'delete', url: `${this.baseEndpoint}/${id}` });
	}

	linkPreview(url: string) {
		return this.request({ url: `${API_URL}link-preview`, data: { url }, method: 'POST' });
	}

	getCurrencyRates(currencyCode: string) {
		return this.request({ url: `https://api.exchangerate-api.com/v4/latest/${currencyCode}` });
	}
}
