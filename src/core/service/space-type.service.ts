import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseService from './base.service';

interface SpaceTypeFilter extends BaseListFilterInterface {
	alias?: string;
	brandId?: number;
	withCache?: boolean;
	withParent?: boolean;
	withChildren?: boolean;
	onlyChildren?: boolean;
}

export default class SpaceTypeService extends BaseService {
	baseEndpoint = 'space-type';

	async list(params: SpaceTypeFilter): Promise<[SpaceTypeInterface[], number]> {
		const [d, t] = await super.list<SpaceTypeInterface, SpaceTypeFilter>(params);
		d.sort((a: SpaceTypeInterface, b: SpaceTypeInterface) => Number(a.order) - Number(b.order));
		return [d, t];
	}

	save(data: SpaceTypeInterface, id: string | number | null | undefined) {
		return super.save<SpaceTypeInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<SpaceTypeInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<SpaceTypeInterface>(id);
	}
}
