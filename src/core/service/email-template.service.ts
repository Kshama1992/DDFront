import EmailTemplateInterface from 'dd-common-blocks/dist/interface/email-template.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseService from './base.service';

interface EmailFiltersInterface extends BaseListFilterInterface {
	brandId?: number | null;
	emailTemplateTypeId?: number | null;
}

export default class EmailTemplateService extends BaseService {
	baseEndpoint = 'email-template';

	async list(params: EmailFiltersInterface) {
		return super.list<EmailTemplateInterface, EmailFiltersInterface>(params);
	}

	save(data: EmailTemplateInterface, id: string | number | null | undefined) {
		return super.save<EmailTemplateInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<EmailTemplateInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<EmailTemplateInterface>(id);
	}

	test(id: string | number, email: string) {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${id}/test`, data: { email } });
	}
}
