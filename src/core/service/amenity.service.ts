import AmenityInterface from 'dd-common-blocks/dist/interface/amenity.interface';
import BaseService from './base.service';

export default class AmenityService extends BaseService {
	baseEndpoint = 'amenity';

	async list(): Promise<[AmenityInterface[], number]> {
		return super.list();
	}
}
