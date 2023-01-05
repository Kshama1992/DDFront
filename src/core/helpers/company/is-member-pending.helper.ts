import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';
import CompanyMemberInterface from 'dd-common-blocks/dist/interface/company-member.interface';

export default function IsMemberPendingHelper(company: CompanyInterface | GroupInterface, userId: number | undefined) {
	if (typeof userId === 'undefined') return false;
	const found = company.members.filter((m: CompanyMemberInterface) => m.userId === userId);
	if (found.length === 0) return false;
	return found[0].status === 'pending';
}
