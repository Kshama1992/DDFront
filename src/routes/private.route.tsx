import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@context/auth.context';
import { parseQueryHelper } from '@helpers/parse-query.helper';

function PrivateRoute({ children }: { children: JSX.Element }) {
	const { authBody } = useContext(AuthContext);
	const { pathname, search, hash } = useLocation();
	const redirect = [pathname, search, hash].join('');
	const queryParams = parseQueryHelper(search);
	return authBody ? children : <Navigate to={`/sign/?redirect=${redirect}${queryParams.isTeamLead ? '&teamLead=true' : ''}`} />;
}

export default PrivateRoute;
