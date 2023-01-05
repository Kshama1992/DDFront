import express from 'express';

// this require is necessary for server HMR to recover from error
// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
let app: any = require('./server').default;

// @ts-ignore
if (module.hot) {
	module.hot.accept('./server', () => {
		console.info('🔁  HMR Reloading `./server`...');
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
			app = require('./server').default;
		} catch (error) {
			console.error(error);
		}
	});
	console.info('✅  Server-side HMR Enabled!');
}

const port = process.env.PORT || 3000;

async function run() {
	return express()
		.use((req, res) => app.handle(req, res))
		.listen(port, () => {
			// if (err) {
			// 	console.error(err);
			// 	return;
			// }
			console.info(`✅ Started on port ${port}`);
		});
}

export default run();
