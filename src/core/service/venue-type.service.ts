import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BaseService from './base.service';

interface VenueTypeFilter extends BaseListFilterInterface {
	alias?: string;
	brandId?: number;
	withCache?: boolean;
	withParent?: boolean;
	withChildren?: boolean;
	onlyChildren?: boolean;
}

export default class VenueTypeService extends BaseService {
	baseEndpoint = 'venue-type';

	async list(params: VenueTypeFilter): Promise<[VenueTypeInterface[], number]> {
		const [d, t] = await super.list<VenueTypeInterface, VenueTypeFilter>(params);
		return [d.sort((a: VenueTypeInterface, b: VenueTypeInterface) => Number(a.order) - Number(b.order)), t];
	}

	save(data: VenueTypeInterface, id: string | number | null | undefined) {
		return super.save<VenueTypeInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<VenueTypeInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<VenueTypeInterface>(id);
	}
}
