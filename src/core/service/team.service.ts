import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import TeamFormValuesInterface from '@forms/interface/team-form-values.interface';
import BaseService from './base.service';

interface RoleFilterInterface extends BaseListFilterInterface {
	teamLeadId?: string | number;
	brandId?: string | number;
}

export default class TeamService extends BaseService {
	baseEndpoint = 'team';

	/**
	 * Add member to team
	 * @param teamId - Team ID
	 * @param userId - Member ID
	 * @returns void
	 */
	async addMember(teamId: string | number | undefined, userId: string | number | undefined): Promise<void> {
		try {
			return await super.request({ method: 'post', url: `${this.baseEndpoint}/${teamId}/member/${userId}` });
		} catch (e) {
			throw BaseService.handleError(e);
		}
	}

	/**
	 * Delete team member
	 * @param teamId - Team ID
	 * @param userId - Member ID
	 * @returns void
	 */
	async deleteMember(teamId: string | number | undefined, userId: string | number | undefined): Promise<void> {
		return super.request({ method: 'delete', url: `${this.baseEndpoint}/${teamId}/member/${userId}` });
	}

	/**
	 * Delete team invite
	 * @param teamId - Team ID
	 * @param inviteId - Invite ID
	 * @returns void
	 */
	async deleteInvite(teamId: string | number | undefined, inviteId: string | number | undefined): Promise<void> {
		return super.request({ method: 'delete', url: `${this.baseEndpoint}/${teamId}/invite/${inviteId}` });
	}

	async listMembers(
		teamId: string | number | undefined,
		params: {
			searchString?: string;
			brandId?: string | number;
			limit?: number;
			offset?: number;
		}
	): Promise<[TeamMemberInterface[], number]> {
		return super.request<[TeamMemberInterface[], number]>({
			method: 'get',
			url: `${this.baseEndpoint}/${teamId}/member`,
			params,
			transformResponse: (r: string) => {
				try {
					const resp = JSON.parse(r);
					return [resp.data, resp.total];
				} catch (e) {
					return r;
				}
			},
		});
	}

	/**
	 * Invite user to team by emails array
	 * @param data
	 */
	async invite(data: { brandId: string; teamId: string; emails: string[] }): Promise<void> {
		return super.request({ method: 'post', url: `${this.baseEndpoint}/${data.teamId}/invite`, data });
	}

	list(params: RoleFilterInterface) {
		return super.list<TeamInterface, RoleFilterInterface>(params);
	}

	save(data: TeamFormValuesInterface, id: string | number | null | undefined) {
		return super.save<TeamFormValuesInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<TeamInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<TeamInterface>(id);
	}
}
