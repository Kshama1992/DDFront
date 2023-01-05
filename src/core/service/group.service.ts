import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import GroupMemberInterface from 'dd-common-blocks/dist/interface/group-member.interface';
import BaseService from './base.service';

interface GroupSearchInterface extends BaseListFilterInterface {
	brandId?: string | number;
}

export default class GroupService extends BaseService {
	baseEndpoint = 'group';

	/**
	 * Add member to group
	 * @param groupId - Group ID
	 * @param userId - Member ID
	 * @returns GroupMemberInterface
	 */
	async addMember(groupId: string | number | undefined, userId: string | number | undefined): Promise<GroupMemberInterface> {
		if (typeof groupId === 'undefined') throw new Error('no group id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<GroupMemberInterface>({ url: `${this.baseEndpoint}/${groupId}/member/${userId}`, method: 'post' });
	}

	/**
	 * Approve group member
	 * @param groupId - Group ID
	 * @param userId - Member ID
	 * @returns void
	 */
	async approveMember(groupId: string | number | undefined, userId: string | number | undefined) {
		if (typeof groupId === 'undefined') throw new Error('no group id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<GroupMemberInterface>({ url: `${this.baseEndpoint}/${groupId}/member/${userId}`, method: 'put' });
	}

	/**
	 * Delete group member
	 * @param groupId - Group ID
	 * @param userId - Member ID
	 * @returns void
	 */
	async deleteMember(groupId: string | number | undefined, userId: string | number | undefined) {
		if (typeof groupId === 'undefined') throw new Error('no group id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<GroupMemberInterface>({ url: `${this.baseEndpoint}/${groupId}/member/${userId}`, method: 'delete' });
	}

	list(params: GroupSearchInterface): Promise<[GroupInterface[], number]> {
		return super.list<GroupInterface, GroupSearchInterface>(params);
	}

	save(data: GroupInterface, id?: string | number | null | undefined) {
		return super.save<GroupInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<GroupInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<GroupInterface>(id);
	}
}
