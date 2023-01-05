import type ReservationStatus from 'dd-common-blocks/dist/type/ReservationStatus';
import type ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import type SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';

export default interface ReservationFormValuesInterface {
	id?: string | number;
	userId?: string | number;
	hoursFrom?: string | Date;
	hoursTo?: string | Date;
	date?: string | Date;
	chargeType?: ChargeType;
	status?: ReservationStatus;
	tzUser?: string;
	tzLocation?: string;
	space?: SpaceInterface;
}
