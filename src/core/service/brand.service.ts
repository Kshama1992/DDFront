import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseService from './base.service';

interface BrandSearchInterface extends BaseListFilterInterface {
	domain?: string;
}

export default class BrandService extends BaseService {
	baseEndpoint = 'brand';

	list(params: BrandFilter) {
		return super.list<BrandInterface, BrandSearchInterface>(params);
	}

	save(data: BrandInterface, id: string | number | null | undefined) {
		return super.save<BrandInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<BrandInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<BrandInterface>(id);
	}
}
