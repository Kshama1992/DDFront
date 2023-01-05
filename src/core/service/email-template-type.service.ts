import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseService from './base.service';

export default class EmailTemplateTypeService extends BaseService {
	baseEndpoint = 'email-template-type';

	async list(params?: BaseListFilterInterface) {
		return super.list<EmailTemplateTypeInterface, BaseListFilterInterface>(params);
	}

	save(data: EmailTemplateTypeInterface, id: string | number | null | undefined) {
		return super.save<EmailTemplateTypeInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<EmailTemplateTypeInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<EmailTemplateTypeInterface>(id);
	}
}
