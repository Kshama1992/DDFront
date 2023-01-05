import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import EmailTemplateInterface from 'dd-common-blocks/dist/interface/email-template.interface';
import BaseService from './base.service';

export type EmailLogFilter = BaseListFilterInterface;
export interface LogItemInterface {
	level: string;
	message: string;
	timestamp: string;
	stack?: string;
	code?: string;
	errno?: string;
	path?: string;
	syscall?: string;
	formatted?: any | any[];
}
export interface LogListItemInterface {
	name: string;
	type: string;
	dateString: string;
	date: string;
	time: string;
}

export interface EmailLogInterface {
	from: string;
	to: string;
	createdAt: string;
	status: string;
	subject: string;
	brandId: number;
	id: number;
	templateId: number;
	statusMessage: any;
	message: string;
	variables: any;
	brand?: BrandInterface;
	template?: EmailTemplateInterface;
}
export default class LogService extends BaseService {
	baseEndpoint = 'log';

	async list(): Promise<[LogListItemInterface[], number]> {
		return this.request({
			method: 'get',
			url: `${this.baseEndpoint}/server`,
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

	async listEmailLogs(params: EmailLogFilter): Promise<[EmailLogInterface[], number]> {
		return this.request({
			method: 'get',
			url: `${this.baseEndpoint}/email`,
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

	getFile(type: string, fileName: string): Promise<LogItemInterface[]> {
		return this.request({
			method: 'get',
			url: `${this.baseEndpoint}/server/${type}/${fileName}`,
		});
	}

	getEmailLog(id: number): Promise<EmailLogInterface> {
		return this.request({
			method: 'get',
			url: `${this.baseEndpoint}/email/${id}`,
		});
	}
}
