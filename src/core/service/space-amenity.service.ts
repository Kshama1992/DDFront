import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';
import BaseService from './base.service';

interface SpaceAmenityFilter extends BaseListFilterInterface {
	spaceId: number | string;
}

export default class SpaceAmenityService extends BaseService {
	baseEndpoint = 'space-amenity';

	async list(opts: SpaceAmenityFilter): Promise<[SpaceAmenityInterface[], number]> {
		return super.list(opts);
	}

	single(id: string | number | undefined) {
		return super.single<SpaceAmenityInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<SpaceAmenityInterface>(id);
	}

	save(data: any, id: string | number | undefined) {
		return super.save<SpaceAmenityInterface>(data, id);
	}
}
