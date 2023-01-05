import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import VenueFilterInterface from 'dd-common-blocks/dist/interface/filter/venue-filter.interface';
import VenueFormValuesInterface from '@forms/interface/venue-form-values.interface';
import BaseService from './base.service';

export default class VenueService extends BaseService {
	baseEndpoint = 'venue';

	/**
	 * List cities where venues registered
	 */
	async listCities(): Promise<Partial<VenueInterface>[]> {
		return super.request<Partial<VenueInterface>[]>({ method: 'get', url: `${this.baseEndpoint}/list-cities` });
	}

	/**
	 * List locations where venues registered
	 * @param searchString
	 * @param venueTypeIds
	 */
	async listLocations(searchString: string, venueTypeIds?: number[] | string[] | undefined): Promise<string[]> {
		return super.request({ method: 'get', url: `${this.baseEndpoint}/list-locations`, params: { searchString, venueTypeIds } });
	}

	/**
	 * Update payment provider info
	 * @param venueId
	 */
	async providerDataUpdate(venueId: number): Promise<string[]> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${venueId}/provider-data-update` });
	}

	/**
	 * Update payment provider info for all venues in app
	 */
	async providerBatchDataUpdate(): Promise<string[]> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/provider-data-batch-update` });
	}

	list(params: VenueFilterInterface): Promise<[VenueInterface[], number]> {
		return super.list<VenueInterface, VenueFilterInterface>(params);
	}

	save(data: VenueFormValuesInterface, id: string | number | null | undefined) {
		return super.save<VenueFormValuesInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<VenueInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<VenueInterface>(id);
	}
}
