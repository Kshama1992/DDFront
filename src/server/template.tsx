import { API_URL, NODE_ENV } from '@core/config';

const GTM =
	NODE_ENV === 'production'
		? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-K6WRHMX');</script>`
		: '';

const GTM_NOSCRIPT =
	NODE_ENV === 'production'
		? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K6WRHMX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
		: '';

export default (markup: string, opts: any, css: any, helmet: any, assets: any) => `
<!doctype html>
    <html ${helmet.htmlAttributes.toString()} lang="en">
    <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        
        <!-- Google Tag Manager -->${GTM}<!-- End Google Tag Manager -->
        
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-site-verification" content="yf-ztwPlQ-w4Q4hMDnSr5hHYkwelmUe1PEJfGHHMXF0" />

        <link rel="dns-prefetch" href="${API_URL}">
        <link rel="preconnect" href="${API_URL}">
        <link rel="dns-prefetch" href="https://maps.googleapis.com">
        <link rel="preconnect" href="https://maps.googleapis.com">
    
        <link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials">
		${css ? `<style id='jss-ssr'>${css}</style>` : ''}          
              ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}

    </head>
    <body ${helmet.bodyAttributes.toString()}>
    
      <!-- Google Tag Manager (noscript) -->${GTM_NOSCRIPT}<!-- End Google Tag Manager (noscript) -->
    
      <div id="root" style="min-height: 100vh">${markup}</div>
          
      <script src="${assets.client.js}" defer crossorigin></script>

 			<link rel="stylesheet" crossorigin href="https://fonts.googleapis.com/css?family=Lato:100,300,400,500,600&display=swap" />
			<link rel="stylesheet" crossorigin href="https://fonts.googleapis.com/icon?family=Material+Icons" />
			<script src="https://maps.googleapis.com/maps/api/js?key=${opts.googleApiKey}&libraries=geometry,drawing,places&language=en"></script>
    </body>
</html>`;
