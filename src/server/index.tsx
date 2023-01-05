import express, { static as expressStatic } from 'express';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { CookiesProvider } from 'react-cookie';
import cookiesMiddleware from 'universal-cookie-express';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import { CacheProvider } from '@emotion/react';
import { Helmet } from 'react-helmet';
import cors from 'cors';
import createEmotionServer from '@emotion/server/create-instance';
import path from 'path';
import { AuthContextProvider } from '@context/auth.context';
import App from '../core/app';
import template from './template';
import DropDeskTheme from '../core/theme';
import createEmotionCache from '../createEmotionCache';

// @ts-ignore
global.window = global.window || ({} as Window);

const publicFolder = process.env.RAZZLE_RUNTIME_NODE_ENV === 'production' ? path.join(__dirname, '../build/public') : 'public';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-dynamic-require
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export const renderApp = (req: express.Request) => {
	const context: any = {};
	const helmet = Helmet.renderStatic();

	const cache = createEmotionCache();
	const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

	const markup = renderToStaticMarkup(
		<CacheProvider value={cache}>
			<DropDeskTheme>
				{/*
  // @ts-ignore */}
				<CookiesProvider cookies={req.universalCookies}>
					<AuthContextProvider>
						<StaticRouter location={req.url}>
							<App />
						</StaticRouter>
					</AuthContextProvider>
				</CookiesProvider>
			</DropDeskTheme>
		</CacheProvider>
	);

	// Grab the CSS from emotion
	const emotionChunks = extractCriticalToChunks(markup);
	const emotionCss = constructStyleTagsFromChunks(emotionChunks);

	const html = template(
		markup,
		{
			googleApiKey: process.env.RAZZLE_RUNTIME_GOOGLE_API_KEY,
		},
		emotionCss,
		helmet,
		assets
	);

	return { html, context };
};

const server = express()
	.disable('x-powered-by')
	.use(cors({ origin: '*' }))
	.use(expressStatic(publicFolder))
	.use(cookiesMiddleware())
	.use(compression())
	.use(
		expressStaticGzip(process.env.RAZZLE_PUBLIC_DIR, {
			enableBrotli: true,
			orderPreference: ['br', 'gz'],
		})
	)
	.get('/*', (req: express.Request, res: express.Response) => {
		const { html, context } = renderApp(req);

		if (context.url) {
			return res.redirect(301, context.url);
		}

		res.send(html);
	});

export default server;
