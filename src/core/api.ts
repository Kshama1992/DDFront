import { capitalize } from '@mui/material/utils';
import axios, { AxiosResponse } from 'axios';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import { API_URL } from './config';

const instance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

instance.interceptors.response.use(
	(response: AxiosResponse<any>) => response.data,
	async (e) => {
		const {
			response: { status },
			config: originalConfig,
		} = e;

		let message = '';
		if (e.request.response) {
			try {
				const d = JSON.parse(e.request.response);
				message = d.message;
				try {
					if (d.data?.length) {
						message += 'Errors: ';
						d.data.forEach(({ property, constraints }: { property: string; constraints: { [key: string]: string } }, i: number) => {
							message += `${i === 0 ? '' : '. '}${capitalize(Object.values(constraints)[0])}`;
						});
					}
				} catch {
					console.error("can't parse response");
				}
				d.message = message;
				if (status === 401 && (message === 'Unauthorized' || message === 'Bad token') && !originalConfig._retry) {
					const { pathname, search, hash } = window.location;
					let redirect = '';
					if (pathname !== '/sign') {
						originalConfig._retry = true;
						try {
							await instance.post(`auth/refresh-token`);
							return await instance(originalConfig);
						} catch (_error) {
							redirect = [pathname, search, hash].join('');
							const queryParams = parseQueryHelper(search);
							window.location.href = `/sign?redirect=${redirect}${queryParams.isTeamLead ? '&teamLead=true' : ''}`;
							return Promise.reject(_error);
						}
					}
				}
				return await Promise.reject(d);
			} catch (e1) {
				console.error(e1);
				return Promise.reject(new Error(e1.message));
			}
		}

		try {
			return await Promise.reject(JSON.parse(e.request.response));
		} catch {
			return Promise.reject(new Error('Internal server error'));
		}
	}
);

export { instance as axios };
