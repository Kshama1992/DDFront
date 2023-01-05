import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import BrandRoleType from 'dd-common-blocks/dist/type/BrandRoleType';

const isSuperAdmin = (user: UserInterface | undefined): boolean => {
	if (!user) return false;
	return user.role.roleType === BrandRoleType.SUPERADMIN || user.role.roleType === BrandRoleType.SUB_SUPERADMIN;
};

const isBrandAdmin = (user: UserInterface | undefined): boolean => {
	if (!user) return false;
	return !isSuperAdmin(user) && user.isAdmin;
};

const isVenueAdmin = (user: UserInterface | undefined): boolean => {
	if (!user) return false;
	return user.role.roleType === BrandRoleType.VENUE_ADMIN;
};

export { isBrandAdmin, isSuperAdmin, isVenueAdmin };
