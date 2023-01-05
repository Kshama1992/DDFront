import React, { useContext } from 'react';
import { AuthContext, isAdmin } from '@context/auth.context';
import { Navigate, useLocation } from 'react-router-dom';

export default function RoleRedirectComponent() {
	const { authBody } = useContext(AuthContext);
	const { pathname } = useLocation();
	if (authBody) {
		if (isAdmin(authBody) && !pathname.includes('dashboard')) return <Navigate to="/dashboard/activity" />;
		if (!isAdmin(authBody) && pathname.includes('dashboard')) return <Navigate to="/locations" />;
	}
	return <></>;
}
