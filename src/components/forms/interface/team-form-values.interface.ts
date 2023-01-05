import type SubFormValues from '@forms/interface/sub-form.interface';
import type UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import type TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';

export default interface TeamFormValuesInterface {
	id?: number;
	name: string;
	brandId: number | string;
	teamLeadId?: number | string;
	createdBy?: UserInterface;
	subscriptions?: Array<SubFormValues>;
	members?: Array<TeamMemberInterface>;
}
