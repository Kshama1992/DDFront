import type UserStatus from 'dd-common-blocks/dist/type/UserStatus';
import type SubFormValues from '@forms/interface/sub-form.interface';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import FileInterface from 'dd-common-blocks/dist/interface/file.interface';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';

export default interface UserFormValuesInterface {
	id?: number | string;
	about?: string;
	firstname?: string;
	lastname?: string;
	username?: string;
	email?: string;
	password?: string;
	securityDepositToRevenue?: number;
	emailVerified?: boolean;
	isAdmin?: boolean;
	stripeCustomerId?: string | null | undefined;
	brandId?: number;
	securityDeposit?: number;
	roleId?: number | string;
	phone?: number | string;
	userId?: number | string;
	firstPass?: string;
	status?: UserStatus;
	subscriptions?: SubFormValues[];
	teamMembership?: TeamMemberInterface[];
	leadingTeams?: TeamInterface[];
	role?: BrandRoleInterface;
	// cards?: Stripe.Card[];
	adminVenues?: VenueInterface[];
	// companies?: CompanyInterface[];
	photo?: FileInterface;
	// subscriptions?: SubscriptionInterface[];
	brand?: BrandInterface;
}
