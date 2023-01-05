import { Dayjs } from 'dayjs';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import InvoiceStatusInterface from 'dd-common-blocks/dist/interface/invoice-status.interface';
import InvoiceFilter from 'dd-common-blocks/dist/interface/filter/invoice-filter.interface';
import BaseService from './base.service';

export interface InvoiceCreateData {
	invoiceStatusId?: string | number | undefined | null;
	spaceId?: string | number | undefined | null;
	userId: string | number;
	startDate: string;
	createdAt?: any;
	endDate: string;
	userTz?: string;
	billLater?: boolean;
	useCredits?: boolean;
	takePayment?: boolean;
	createdById?: string | number | undefined;
	refundAmount?: number | string;
	refundNote?: string;
	teamName?: string;
	currency?: string;
	processDate?: string | null | undefined | Dayjs;
}

export default class InvoiceService extends BaseService {
	baseEndpoint = 'invoice';

	async statusList(): Promise<[InvoiceStatusInterface[], number]> {
		return super.request({
			method: 'get',
			url: `invoice-status`,
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

	list(params: InvoiceFilter) {
		// @ts-ignore
		return super.list<InvoiceInterface, InvoiceFilter>(params);
	}

	// TODO: fix ts typings
	save(data: any, id?: string | number | null | undefined) {
		return super.save<InvoiceInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<InvoiceInterface>(id);
	}

	async checkIn(spaceId: string | number | undefined, userId: string | number | undefined, userTz: string): Promise<void> {
		if (typeof spaceId === 'undefined') throw new Error('no space id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/check-in`, data: { spaceId, userId, userTz } });
	}

	async checkOut(reservationId: string | number | undefined): Promise<InvoiceInterface> {
		if (typeof reservationId === 'undefined') throw new Error('no id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/charge-hours`, data: { reservationId } });
	}

	async changeStatus(
		invoiceId: string | number | undefined,
		data: { statusId: number; refundAmount?: number; refundNote?: string }
	): Promise<InvoiceInterface> {
		if (typeof invoiceId === 'undefined') throw new Error('no id');
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${invoiceId}/change-status`, data });
	}
}
