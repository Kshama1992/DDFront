import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { APP_DOMAIN } from '../core/config';

export default function MetaComponent({
	quote,
	image,
	title,
	description,
	hashtag,
}: {
	quote?: string | undefined;
	image?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	hashtag?: string | undefined;
}) {
	const defaultTitle = 'DropDesk - Find Workspace & Meeting Rooms Near You';
	const location = useLocation();
	const currentUrl = `https://${APP_DOMAIN}${location.pathname}`;
	const metaQuote = quote || '';
	const metaTitle = `${title}` || defaultTitle;
	const metaImage = `https://${APP_DOMAIN}${image}` || '/images/default-image.jpg';
	const metaDescription = description || 'Coworking Space, Meeting Rooms, and Private Workspace All On Demand';
	const metaHashtag = hashtag || '#dropdesk';

	return (
		<Helmet>
			<title>{metaTitle}</title>
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta name="csrf_token" content="" />
			<meta property="type" content="article" />
			<meta property="url" content={currentUrl} />
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
			<meta name="msapplication-TileColor" content="#ffffff" />
			<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
			<meta name="theme-color" content="#ffffff" />
			<meta name="_token" content="" />
			<meta name="robots" content="noodp" />
			<meta property="title" content={title} />
			<meta name="description" content={metaDescription} />
			<meta property="image" content={metaImage} />
			<meta property="quote" content={metaQuote} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:quote" content={metaQuote} />
			<meta property="og:hashtag" content={metaHashtag} />
			<meta content="image/*" property="og:image:type" />
			<meta property="og:url" content={currentUrl} />
			<meta property="og:site_name" content="CampersTribe" />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:image" content={metaImage} />
		</Helmet>
	);
}
