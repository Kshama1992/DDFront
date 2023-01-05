import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import SpaceAvailability from 'dd-common-blocks/dist/interface/space-availability.interface';
import SpacePinsOutputInterface from 'dd-common-blocks/dist/interface/custom-output/space-pins-output.interface';
import BaseService from './base.service';

interface SpaceAvailabilityFilter {
	userId: string | number;
	startDate: string;
	endDate: string;
	userTZ?: string;
	excludeReservationId?: number | undefined;
}

export default class SpaceService extends BaseService {
	baseEndpoint = 'space';

	/**
	 * Show pins on map by space filter
	 * @param params
	 */
	async listPins(params: SpaceFilterInterface): Promise<SpacePinsOutputInterface[]> {
		return super.request<SpacePinsOutputInterface[]>({ method: 'get', url: `${this.baseEndpoint}/list-pins`, params });
	}

	/**
	 * Get space by space alias and venue alias
	 * @param alias
	 * @param venueAlias
	 * @param params
	 */
	async bySlug(alias: string, venueAlias: string, params?: any): Promise<SpaceInterface | null> {
		return super.request<SpaceInterface>({ method: 'get', url: `${this.baseEndpoint}/alias/${venueAlias}/${alias}` });
	}

	/**
	 * Get space availability dates and time
	 * @param id
	 * @param params
	 */
	async availability(id: string | number, params: SpaceAvailabilityFilter): Promise<SpaceAvailability[]> {
		return super.request<SpaceAvailability[]>({ method: 'get', url: `${this.baseEndpoint}/${id}/availability`, params });
	}

	save(data: SpaceInterface, id?: string | number | null | undefined) {
		const cloneData = { ...data };
		cloneData.venue = undefined;
		cloneData.spaceType = undefined;
		cloneData.reservation = undefined;

		return super.save<SpaceInterface>(cloneData, id);
	}

	single(id: string | number | undefined) {
		return super.single<SpaceInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<SpaceInterface>(id);
	}

	async list(params: SpaceFilterInterface): Promise<[SpaceInterface[], number]> {
		return super.list(params);
	}
}
