import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { AuthContextProvider } from '@context/auth.context';
import { CacheProvider } from '@emotion/react';
import '../index.css';
import App from '../core/app';
import * as serviceWorker from '../serviceWorker';
import DropDeskTheme from '../core/theme';
import createEmotionCache from '../createEmotionCache';

const cache = createEmotionCache();

const container = document.getElementById('root');

hydrateRoot(
	container,
	<CacheProvider value={cache}>
		<DropDeskTheme>
			<CookiesProvider>
				<AuthContextProvider>
					<Router>
						<App />
					</Router>
				</AuthContextProvider>
			</CookiesProvider>
		</DropDeskTheme>
	</CacheProvider>
);

serviceWorker.unregister();

if (module.hot) {
	module.hot.accept();
}
