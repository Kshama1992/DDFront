import React, { useCallback, useEffect, useState, createContext, useMemo, createRef } from 'react';
import CurrencyInterface from 'dd-common-blocks/dist/interface/custom/currency.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import SocketEventsType from 'dd-common-blocks/dist/type/SocketEventsType';
import HoursType from 'dd-common-blocks/dist/type/HoursType';
// eslint-disable-next-line import/no-cycle
import UserService from '@service/user.service';
import BrandService from '@service/brand.service';
import { GeolocationData } from '@helpers/geolocate.helper';
import { getCookieUserHelper, getUserDataHelper, resetAuthHelper, setBrandDataHelper, setUserDataHelper } from '@helpers/auth.helper';
import { deleteLocalStorage, getCookie, setCookie } from '@helpers/storage.helper';
import { getUserLocationHelper } from '@helpers/get-user-location.helper';
// eslint-disable-next-line import/no-cycle
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { googleTimezoneHelper } from '@helpers/google-timezone.helper';
// eslint-disable-next-line import/no-cycle
import { isSuperAdmin as isSuperAdminFunc } from '@helpers/user/is-admin.helper';
import ipLookUpHelper from '@helpers/ip-lookup.helper';
import currencyList from 'dd-common-blocks/libs/currency.json';
import countryCurrency from 'dd-common-blocks/libs/country-currency.json';
import LoadingComponent from '../../routes/loading.component';
import { APP_DOMAIN, DEFAULT_BRAND_NAME, DEFAULT_CURRENCY } from '../config';
import socket from '../socket';

interface UserOptions {
	subscriptionId?: number | string;
	creditHoursType?: HoursType | undefined;
}

interface DefaultContext {
	isAuthenticated: boolean;
	isTeamLead: boolean;
	isTeamMember: boolean;
	authBody: UserInterface | undefined;
	userCurrency: CurrencyInterface | undefined;
	userOptions: UserOptions | undefined;
	userLocation: GeolocationData | undefined;
	currencyRate: { [key: string]: number }[] | undefined;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	logOut: (redirectToHome?: boolean) => void;
	setUserData: (user: UserInterface) => void;
	updateAuthData: () => void;
	updateCheckinData: () => void;
	setAuthBody: (authBody: UserInterface) => void;
	setUserOptions: (userOptions: UserOptions) => void;
	setUserLocation: (userLocation: GeolocationData) => void;
	setUserCurrency: (userCurrency: CurrencyInterface) => void;
	setCurrencyRate: (currencyRate: { [key: string]: number }[]) => void;
	isBrandAdmin: boolean;
	isSuperAdmin: boolean;
	currentBrand: BrandInterface | undefined;
	userCheckins: ReservationInterface[];
}

// @ts-ignore
export const AuthContext = createContext<DefaultContext>();

export const DEFAULT_LOCATION = {
	countryCode: 'US',
	country: 'United States',
	city: 'New York',
	state: 'New York',
	latitude: 40.7127753,
	longitude: -74.0059728,
	timezone: 'America/New_York',
	utc_offset: -300,
};

export const isAdmin = (authBody: UserInterface | undefined) => {
	if (!authBody) return false;
	return isSuperAdminFunc(authBody) || (!isSuperAdminFunc(authBody) && authBody.isAdmin);
};

const getUserOptions = () => {
	try {
		const data = getCookie('userOptions');

		if (data) {
			return JSON.parse(data);
		}
		return { subscriptionId: '', creditHoursType: '' };
	} catch (e) {
		return { subscriptionId: '', creditHoursType: '' };
	}
};

const getUserCurrency = () => {
	const data = getCookie('userCurrency');
	try {
		if (data && typeof data === 'object') return data;
		if (data && typeof data === 'string') return JSON.parse(data);
		return DEFAULT_CURRENCY;
	} catch (e) {
		return DEFAULT_CURRENCY;
	}
};

export const AuthContextProvider = ({ children }: { children: any }) => {
	const userService = new UserService();
	const brandService = new BrandService();
	const [isContextInited, setIsContextInited] = useState<boolean>(false);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isTeamLead, setIsTeamLead] = useState<boolean>(false);
	const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
	const [authBody, setAuthBody] = useState<UserInterface>();
	const [userCheckins, setUserCheckins] = useState<ReservationInterface[]>([]);
	const [currentBrand, setCurrentBrand] = useState<BrandInterface>();
	const [isBrandAdmin, setIsBrandAdmin] = useState<boolean>(false);
	const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
	const [userLocation, setUserLocation] = useState<GeolocationData>();
	const [userOptions, setUserOptions] = useState<UserOptions>({ subscriptionId: '', creditHoursType: undefined });
	const [userCurrency, setUserCurrency] = useState<CurrencyInterface>();
	const [currencyRate, setCurrencyRate] = useState<{ [key: string]: number }[]>();
	const [loaded, setLoaded] = useState<boolean>(false);

	const logOut = async (redirectToHome = true) => {
		deleteLocalStorage('authBody');
		socket.disconnect();
		setAuthBody(undefined);
		setIsAuthenticated(false);
		setIsBrandAdmin(false);
		setIsSuperAdmin(false);
		setIsTeamLead(false);
		setIsTeamMember(false);
		await resetAuthHelper();
		if (redirectToHome) window.location.href = `//${APP_DOMAIN}/`;
	};

	const loadCheckin = useCallback(
		async (id: any) => {
			try {
				const checkins = await userService.checkins(id);
				setUserCheckins(checkins);
			} catch (e) {
				console.error(e);
			}
		},
		[authBody]
	);

	const updateCheckinData = async () => {
		try {
			if (typeof authBody === 'undefined') return;
			loadCheckin(authBody.id).then();
		} catch (e) {
			console.error(e);
		}
	};

	const setUserData = (userData: UserInterface) => {
		if (userData && userData.id) {
			setAuthBody(userData);
			setUserOptions(getUserOptions());
			setIsAuthenticated(true);

			setIsTeamLead(typeof userData.leadingTeams !== 'undefined' && userData.leadingTeams.length > 0);
			setIsTeamMember(
				typeof userData.teamMembership !== 'undefined' &&
					userData.teamMembership.length > 0 &&
					(!userData.leadingTeams || !userData.leadingTeams.length)
			);
			setIsSuperAdmin(isSuperAdminFunc(userData));
			setIsBrandAdmin(!isSuperAdminFunc(userData) && userData.isAdmin);

			setUserDataHelper(userData);
			if (!userData.isAdmin) loadCheckin(userData.id).then();
		}
	};

	/**
	 * Update user data. Mostly to update user subscriptions from socket.
	 * TODO: revise user subscriptions updates
	 * 1. check user data from state. of nothing there do nothing
	 * 2. check token. if no token do logout
	 * 3. if all is ok load and set user data
	 */
	const updateAuthData = async () => {
		try {
			const userData = getUserDataHelper();
			if (typeof userData === 'undefined') return;

			const uCookieData = getCookieUserHelper();
			if (!uCookieData) {
				await logOut(false);
				return;
			}

			const profile = await userService.single(userData.id);
			setUserData(profile);
		} catch (e) {
			console.error(e);
		}
	};

	const initSocket = (userData: UserInterface) => {
		socket.connect();

		// socket
		// 	.off(SocketEventsType.USER_CONNECTED, () => {})
		// 	.on(SocketEventsType.USER_CONNECTED, () => {
		// 		socket.emit('create', `${userData.id}`);
		// 	});

		socket
			.off(SocketEventsType.USER_CREDIT_HOURS_UPDATED, () => {})
			.on(SocketEventsType.USER_CREDIT_HOURS_UPDATED, () => {
				updateAuthData().then();
			});

		socket
			.off(SocketEventsType.USER_SUBSCRIPTION_UPDATED, () => {})
			.on(SocketEventsType.USER_SUBSCRIPTION_UPDATED, () => {
				updateAuthData().then();
			});

		socket
			.off(SocketEventsType.USER_DATA_UPDATED, () => {})
			.on(SocketEventsType.USER_DATA_UPDATED, () => {
				updateAuthData().then();
			});

		socket
			.off(SocketEventsType.USER_SUBSCRIPTION_CANCELED, () => {})
			.on(SocketEventsType.USER_SUBSCRIPTION_CANCELED, () => {
				updateAuthData().then();
			});

		// socket
		// 	.off(SocketEventsType.USER_INVOICE_UPDATED, () => {})
		// 	.on(SocketEventsType.USER_INVOICE_UPDATED, () => {
		// 		updateAuthData().then();
		// 	});

		socket
			.off(SocketEventsType.PASSWORD_CHANGED, () => {})
			.on(SocketEventsType.PASSWORD_CHANGED, () => {
				logOut(true).then();
			});
	};

	const loadBrand = useCallback(async () => {
		try {
			const firstDomain = window.location.host.split('.')[0];

			const params: { searchString?: string; domain?: string } = {};
			if (firstDomain === APP_DOMAIN || ['app', 'dev', 'beta', 'staging', 'stage'].includes(firstDomain)) {
				params.searchString = DEFAULT_BRAND_NAME;
			} else {
				params.domain = firstDomain;
			}
			const [brands] = await brandService.list(params);
			if (brands && brands.length) setCurrentBrand(brands[0]);
		} catch (e) {
			console.error(e);
		}
	}, [currentBrand]);

	const loadUserData = useCallback(
		async (id: any) => {
			try {
				const profile = await userService.single(id);
				setUserData(profile);
				initSocket(profile);
			} catch (e) {
				console.error(e);
			}
		},
		[authBody]
	);

	const geolocate = async (): Promise<void> => {
		try {
			const {
				coords: { longitude, latitude },
			} = await getUserLocationHelper({ timeout: 5000 });
			// } = await getUserLocationHelper({ timeout: NODE_ENV === 'development' ? 10000 : 5000 });

			const location = await googleGeocodeHelper({ location: { lat: latitude, lng: longitude } }).then((res) =>
				googleTimezoneHelper(res.latitude, res.longitude).then((tzres) => ({ ...res, ...tzres }))
			);
			if (!location.country) throw new Error('no country after google geolocate');
			const clone = { ...location };
			// delete clone.city;
			setUserLocation(clone);

			if (!location.countryCode) return;

			// @ts-ignore
			const locationCurrencyCode = countryCurrency[location.countryCode];
			// @ts-ignore
			const locationCurrency = currencyList[locationCurrencyCode];

			if (locationCurrency) {
				setCookie('userCurrency', locationCurrency);
			}
		} catch (e) {
			const ipLocation = await ipLookUpHelper();

			if (ipLocation) {
				const clone = { ...ipLocation };
				// delete clone.city;
				setUserLocation(clone);
			}
		}
	};

	const redirectToSignIn = () => {
		const signInPath = '/sign';
		if (signInPath !== window.location.pathname) {
			window.location.href = signInPath;
		}
	};

	const setAppInited = () => {
		setLoaded(true);
		setIsContextInited(true);
	};

	/**
	 * Step 1
	 * Load location
	 */
	const doGeolocation = async () => {
		try {
			const data = getCookie('userLocation');
			let obj;
			if (data && typeof data === 'object') obj = data;
			if (data && typeof data === 'string') obj = JSON.parse(data);
			if (!obj.country) throw new Error('wrong cache item');
			setUserLocation(obj);
		} catch (e) {
			if ('geolocation' in navigator) {
				await geolocate();
			} else {
				const clone = { ...DEFAULT_LOCATION };
				// @ts-ignore
				delete clone.city;
				setUserLocation(clone);
			}
		}
	};
	/**
	 * Init step
	 * 1. set user loocation
	 * 2. set user brand
	 * 3. set currency and save todays currency rate
	 * 4. init user
	 * 4.1 check for token.
	 * 4.1.1 if no token set loading to true and null user data
	 * 4.1.2 if token expired redirect ot sign in page
	 * 4.2 check user data in local storage
	 * 4.2.1 if user ID from local storage and user ID from token is not the same - redirect to sign in page.
	 * 4.2.2 if no user in local storage - load and set user data
	 * 4.2.3 if user data is ok - just set it and init socket
	 */
	useEffect(() => {
		if (isContextInited) return;

		doGeolocation().then(() => {
			/**
			 * Step 2
			 * Load brand
			 */
			loadBrand().then();

			/**
			 * Step 3
			 * Load user currency and save today currency rate
			 */
			setUserCurrency(getUserCurrency());
			setCurrencyRate(getCookie(`currencyRates_${getUserCurrency().code}`) || []);

			/**
			 * Step 4.1
			 */
			const uCookieData = getCookieUserHelper();

			/**
			 * 4.1.1 no token. do nothing
			 */
			if (!uCookieData) {
				logOut(false).then();
				setAppInited();
				return;
			}

			/**
			 * 4.1.2 no token or expired
			 */
			if (!uCookieData || typeof uCookieData.id === 'undefined') {
				setAppInited();
				redirectToSignIn();
				return;
			}

			const { id } = uCookieData;
			const userData = getUserDataHelper();

			/**
			 * Step 4.2.1 if user ID from local storage and user ID from token is not the same - redirect to sign in page.
			 */
			if (typeof userData !== 'undefined' && userData.id !== id) {
				setAppInited();
				redirectToSignIn();
				return;
			}

			/**
			 * 4.2.2 if no user in local storage - load and set user data
			 */
			if (!userData) {
				loadUserData(id).then(() => setAppInited());
				return;
			}

			/**
			 * 4.2.3 if user data is ok - just set it and init socket
			 */
			setUserData(userData);
			initSocket(userData);
			setAppInited();
		});
	}, []);

	useEffect(() => {
		if (currentBrand) {
			setBrandDataHelper(currentBrand);
		}
	}, [currentBrand]);

	useEffect(() => {
		if (userLocation && typeof userLocation.country !== 'undefined') {
			setCookie('userLocation', userLocation);
		}
	}, [userLocation]);

	useEffect(() => {
		if (userCurrency) setCookie('userCurrency', userCurrency);
	}, [userCurrency]);

	useEffect(() => {
		setCookie('userOptions', userOptions);
	}, [userOptions]);

	const value = useMemo(
		() => ({
			isAuthenticated,
			isTeamLead,
			isTeamMember,
			setIsAuthenticated,
			authBody,
			logOut,
			setAuthBody,
			userLocation,
			setUserLocation,
			userOptions,
			setUserOptions,
			userCurrency,
			setUserCurrency,
			currencyRate,
			setCurrencyRate,
			isSuperAdmin,
			isBrandAdmin,
			updateAuthData,
			currentBrand,
			userCheckins,
			updateCheckinData,
			setUserData,
		}),
		[authBody, userCurrency, currentBrand, currencyRate, userCheckins, userOptions, userLocation]
	);

	const ref = createRef();

	if (loaded) {
		return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
	}

	return <LoadingComponent ref={ref} />;
};
