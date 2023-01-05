import type AccessHFormValues from '@forms/interface/access-h-form-values.interface';
import type CreditsFormValues from '@forms/interface/credit-h-form-values.interface';
import { Dayjs } from 'dayjs';
import type ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import type BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import type SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import type SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import type TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import type VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import type SubscriptionStatus from 'dd-common-blocks/dist/type/SubscriptionStatus';
import type VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';

export default interface SubFormValues {
	id?: number | string;
	teamName?: string;
	name: string;
	startDate?: string | Dayjs | Date;
	endDate?: string | Dayjs | Date;
	payDate?: Date | undefined | string;
	access247: boolean;
	takePayment: boolean;
	securityAmount: number;
	billCycleDate: number;
	spaceId?: number | string;
	venueId?: number | string;
	brandId?: number | string;
	userId?: number | string;
	spaceAmount: number;
	status: SubscriptionStatus;
	isOngoing?: boolean;
	chargeType: ChargeType;
	creditHours: Array<CreditsFormValues>;
	space?: SpaceInterface;
	venueTypes?: Array<VenueTypeInterface>;
	spaceTypes?: Array<SpaceTypeInterface>;
	brands?: Array<BrandInterface>;
	venues?: Array<VenueInterface>;
	teams?: Array<TeamInterface>;
}
