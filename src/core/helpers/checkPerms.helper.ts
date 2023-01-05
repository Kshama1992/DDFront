import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { isSuperAdmin } from './user/is-admin.helper';

export function hasPerm(name: string, user: UserInterface | undefined) {
	if (!user) return true;
	if (user.role && user.role.permissions) {
		return user.role.permissions.filter((p) => p.name === name).length > 0;
	}
	return false;
}

export default function checkPermsHelper(customerPerms: string[], adminPerms: string[], user: UserInterface | undefined, forceCheck?: boolean) {
	if (!user) return true;
	if (!forceCheck && isSuperAdmin(user)) return true;

	let userPerms: string[] = [];

	if (user.role && user.role.permissions) {
		userPerms = user.role.permissions.map((p) => String(p.name));
	}

	if (user.isAdmin) {
		if (!adminPerms.length) return true;

		return adminPerms.some((s: string) => userPerms.includes(s));
	}

	if (!customerPerms.length) return true;
	return customerPerms.some((s: string) => userPerms.includes(s));
}

export function canEdit(user: UserInterface) {
	if (!user) return false;
	return isSuperAdmin(user);
}
