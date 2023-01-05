import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';

export default function IsMemberHelper(company: CompanyInterface | GroupInterface, userId: number | undefined) {
	if (typeof userId === 'undefined') return false;
	if (userId === company.createdById || typeof company.members === 'undefined') return false;
	const member = company.members.find((u) => u.userId === userId);
	return typeof member !== 'undefined';
}
