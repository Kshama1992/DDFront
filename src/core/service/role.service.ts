import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import UserPermissionsInterface from 'dd-common-blocks/dist/interface/user-permission.interface';
import BaseService from './base.service';

interface RoleFilterInterface extends BaseListFilterInterface {
	brandId?: number;
	type?: string;
}

interface RolePermsFiler {
	accessLevel?: string;
	limit?: number;
}

export default class RoleService extends BaseService {
	baseEndpoint = 'role';

	list(params: RoleFilterInterface): Promise<[BrandRoleInterface[], number]> {
		return super.list<BrandRoleInterface, RoleFilterInterface>(params);
	}

	save(data: BrandRoleInterface, id: string | number | null | undefined) {
		return super.save<BrandRoleInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<BrandRoleInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<BrandRoleInterface>(id);
	}

	listPermissions(params: RolePermsFiler): Promise<[UserPermissionsInterface[], number]> {
		return super.request({
			method: 'get',
			url: `user-permissions`,
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
}
