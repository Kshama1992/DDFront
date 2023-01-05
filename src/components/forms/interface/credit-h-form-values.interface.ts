import type HoursType from 'dd-common-blocks/dist/type/HoursType';

export default interface CreditsFormValues {
	id?: string | number;
	notRecurring: boolean;
	recurringForever: boolean;
	rollover: boolean;
	recurringMonth: number;
	used?: number | string;
	monthlyAmount?: number | string;
	given?: number | string;
	subscriptionId?: number | string;
	type: HoursType;
}
