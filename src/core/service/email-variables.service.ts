import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import EmailVariableInterface from 'dd-common-blocks/dist/interface/email-variable.interface';
import BaseService from './base.service';

export default class EmailVariablesService extends BaseService {
	baseEndpoint = 'email-variables';

	async list(params?: BaseListFilterInterface) {
		return super.list<EmailVariableInterface, BaseListFilterInterface>(params);
	}

	save(data: EmailVariableInterface, id: string | number | null | undefined) {
		return super.save<EmailVariableInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<EmailVariableInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<EmailVariableInterface>(id);
	}
}
