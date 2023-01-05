import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import CompanyMemberInterface from 'dd-common-blocks/dist/interface/company-member.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseService from './base.service';

interface CompanySearchInterface extends BaseListFilterInterface {
	brandId?: string | number;
}

export default class CompanyService extends BaseService {
	baseEndpoint = 'company';

	/**
	 * Add member to company
	 * @param companyId - Company ID
	 * @param userId - Member ID
	 * @returns CompanyMemberInterface
	 */
	async addMember(companyId: string | number | undefined, userId: string | number | undefined): Promise<CompanyMemberInterface> {
		if (typeof companyId === 'undefined') throw new Error('no company id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<CompanyMemberInterface>({ url: `${this.baseEndpoint}/${companyId}/member/${userId}`, method: 'post' });
	}

	/**
	 * Approve company member
	 * @param companyId - Company ID
	 * @param userId - Member ID
	 * @returns void
	 */
	async approveMember(companyId: string | number | undefined, userId: string | number | undefined) {
		if (typeof companyId === 'undefined') throw new Error('no company id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<CompanyMemberInterface>({ url: `${this.baseEndpoint}/${companyId}/member/${userId}`, method: 'put' });
	}

	/**
	 * Delete company member
	 * @param companyId - Company ID
	 * @param userId - Member ID
	 * @returns void
	 */
	async deleteMember(companyId: string | number | undefined, userId: string | number | undefined) {
		if (typeof companyId === 'undefined') throw new Error('no company id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<CompanyMemberInterface>({ url: `${this.baseEndpoint}/${companyId}/member/${userId}`, method: 'delete' });
	}

	list(params: CompanySearchInterface): Promise<[CompanyInterface[], number]> {
		return super.list<CompanyInterface, CompanySearchInterface>(params);
	}

	save(data: CompanyInterface, id?: string | number | null | undefined) {
		return super.save<CompanyInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<CompanyInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<CompanyInterface>(id);
	}
}
