import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import ReservationFilter from 'dd-common-blocks/dist/interface/filter/reservation-filter.interface';
import ReservationFormValuesInterface from '@forms/interface/reservation-form-values.interface';
import BaseService from './base.service';

export default class ReservationService extends BaseService {
	baseEndpoint = 'reservation';

	list(params: ReservationFilter) {
		return super.list<ReservationInterface, ReservationFilter>(params);
	}

	delete(id: string | number | undefined) {
		return super.delete<ReservationInterface>(id);
	}

	async save(data: ReservationFormValuesInterface, id?: number | string | undefined | null): Promise<ReservationInterface> {
		// @ts-ignore
		return super.save<ReservationInterface>(data, id);
	}
}
