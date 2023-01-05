import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';

export default function IsMemberOwnerHelper(company: CompanyInterface | GroupInterface, userId: number | undefined) {
	if (typeof userId === 'undefined') return false;
	return company.createdById === userId;
}
