import { io } from 'socket.io-client';
import { Cookies } from 'react-cookie';
import { API_URL } from './config';

const cookiesIns = new Cookies();

// @ts-ignore
const socket = io(API_URL, {
	path: '/ws',
	forceNew: true,
	autoConnect: true,
	reconnection: true,
	reconnectionDelay: 3000,
	transports: ['websocket', 'polling'],
});

socket.on('connect_error', (err: any) => {
	socket.io.opts.transports = ['polling', 'websocket'];

	if (err.message === 'invalid credentials') {
		const token = cookiesIns.get('token');
		if (token) {
			// @ts-ignore
			socket.auth.token = cookiesIns.get('token');
			socket.disconnect().connect();
		} else socket.disconnect();
	} else socket.disconnect();
});

export default socket;
