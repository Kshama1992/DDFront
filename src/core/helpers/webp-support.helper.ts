let support: boolean;

/**
 * Check browser webp support
 * @returns {boolean}
 */
export const isWebpSupported = () => {
	if (typeof support !== 'undefined') return support;

	const elem = typeof document === 'object' ? document.createElement('canvas') : {};

	// @ts-ignore
	support = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;

	return support;
};

export const getWebpImageUrl = (url: string) => {
	const webpSupport = isWebpSupported();
	if (!webpSupport) return url;
	return url.replace(/\.(png|jpg|jpeg|gif)($|\?)/, '.webp');
};
