'use strict';
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
// const devcert = require('devcert');
const Dotenv = require('dotenv-webpack');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const countryList =
	'af,al,dz,as,ad,ao,ai,ag,ar,am,aw,au,at,az,bs,bh,bd,bb,by,be,bz,bj,bm,bt,bo,ba,bw,br,io,vg,bn,bg,bf,bi,kh,cm,ca,cv,bq,ky,cf,td,cl,cn,co,km,cd,cg,ck,cr,ci,hr,cu,cw,cy,cz,dk,dj,dm,do,ec,eg,sv,gq,er,ee,et,fk,fo,fj,fi,fr,gf,pf,ga,gm,ge,de,gh,gi,gr,gl,gd,gp,gu,gt,gn,gw,gy,ht,hn,hk,hu,is,in,id,ir,iq,ie,il,it,jm,jp,jo,kz,ke,ki,xk,kw,kg,la,lv,lb,ls,lr,ly,li,lt,lu,mo,mk,mg,mw,my,mv,ml,mt,mh,mq,mr,mu,mx,fm,md,mc,mn,me,ms,ma,mz,mm,na,nr,np,nl,nc,nz,ni,ne,ng,nu,nf,kp,mp,no,om,pk,pw,ps,pa,pg,py,pe,ph,pl,pt,pr,qa,re,ro,ru,rw,bl,sh,kn,lc,mf,pm,vc,ws,sm,st,sa,sn,rs,sc,sl,sg,sx,sk,si,sb,so,za,kr,ss,es,lk,sd,sr,sz,se,ch,sy,tw,tj,tz,th,tl,tg,tk,to,tt,tn,tr,tm,tc,tv,vi,ug,ua,ae,gb,us,uy,uz,vu,va,ve,vn,wf,ye,zm,zw';

module.exports = {
	modifyOptions({ options: { razzleOptions } }) {
		// if (process.env.NODE_ENV === 'development')
		// 	return new Promise(async (resolve) => {
		// 		const httpsCredentials = await devcert.certificateFor('localhost');
		// 		razzleOptions.HTTPS_CREDENTIALS = {
		// 			key: httpsCredentials.key.toString(),
		// 			cert: httpsCredentials.cert.toString(),
		// 		};
		// 		resolve(razzleOptions);
		// 	});

		return razzleOptions;
	},
	modifyWebpackOptions({ env: { dev, target }, options: { razzleOptions, webpackOptions } }) {
		// if (target === 'node' && process.env.NODE_ENV === 'development') {
		// 	webpackOptions.definePluginOptions.HTTPS_CREDENTIALS = JSON.stringify(razzleOptions.HTTPS_CREDENTIALS);
		// }
		return webpackOptions;
	},
	options: {
		verbose: true, // set to true to get more info/error output
		debug: {
			// debug flags
			options: false, // print webpackOptions that will be used in webpack config
			config: false, // print webpack config
			nodeExternals: false, // print node externals debug info
		},
		buildType: 'iso', // 'iso', 'spa', 'serveronly', 'iso-serverless' and 'serveronly-serverless'
		cssPrefix: 'static/css',
		jsPrefix: 'static/js',
		mediaPrefix: 'static/media',
		staticCssInDev: false, // static css in development build (incompatible with css hot reloading)
		browserslist: undefined, // or what your apps package.json says
		enableSourceMaps: process.env.NODE_ENV !== 'production',
		enableReactRefresh: false,
		enableTargetBabelrc: false, // enable to use .babelrc.node and .babelrc.web
		enableBabelCache: true,
		forceRuntimeEnvVars: [], // force env vars to be read from env e.g. ['HOST', 'PORT']
		disableWebpackbar: false, // can be true to disable all environments or target to disable specific environment such as "node" or "web"
		staticExport: {
			parallel: 5, // how many pages to render at a time
			routesExport: 'routes',
			renderExport: 'render',
			scriptInline: true,
			windowRoutesVariable: 'RAZZLE_STATIC_ROUTES',
			windowRoutesDataVariable: 'RAZZLE_STATIC_DATA_ROUTES',
		},
	},
	plugins: [
		{
			name: 'compression',
			options: {
				brotli: true,
				gzip: true,
				compressionPlugin: {
					filename: '[path].gz[query]',
					algorithm: 'gzip',
					test: /\.(js|css|html|svg)$/,
					compressionOptions: { level: 9 },
					minRatio: 0.8,
				},
				brotliPlugin: {
					asset: '[path].br[query]',
					test: /\.(js|css|html|svg)$/,
					minRatio: 0.8,
				},
			},
		},
		// 'typescript',
		new MiniCssExtractPlugin(),
		{
			name: 'brotli-gzip-zopfli',
			options: {
				brotli: true,
				gzip: true,
				zopfli: false,
				gzipBoth: false,
				gzipSettings: {
					filename: '[path][base].gz',
					test: /\.(js|css|html|svg|md)$/,
					compressionOptions: { level: 9 },
					threshold: 8192,
					minRatio: 0.8,
					deleteOriginalAssets: false,
					cache: false,
				},
				brotliSettings: {
					filename: '[path][base].br',
					test: /\.(js|css|html|svg|md)$/,
					compressionOptions: { level: 11 },
					threshold: 10240,
					minRatio: 0.8,
					deleteOriginalAssets: false,
					cache: false,
				},
				zopfliSettings: {
					filename: '[path][base].gz',
					test: /\.(js|css|html|svg|md)$/,
					threshold: 8192,
					minRatio: 0.8,
					deleteOriginalAssets: false,
					cache: false,
					compressionOptions: {
						numiterations: 15,
					},
				},
			},
		},
		{
			name: 'typescript',
			options: {
				useBabel: true,
				tsLoader: {
					transpileOnly: true,
					experimentalWatchApi: true,
				},
				forkTsChecker: {
					typescript: {
						memoryLimit: 5098,
					},
					eslint: {
						files: ['./src/**/*.ts', './src/**/*.tsx'],
					},
				},
			},
		},
	],

	modifyWebpackConfig({ env: { target, dev }, webpackConfig, options: { razzleOptions } }) {
		// if (target === 'web' && process.env.NODE_ENV === 'development') {
		// 	webpackConfig.devServer.https = razzleOptions.HTTPS_CREDENTIALS;
		// 	// webpackConfig.devServer.port = 9000;
		// 	// webpackConfig.devServer.before = function (app, server, compiler) {
		// 	//   app.use(cors('*'));    console.log('web');
		// 	//
		// 	// }
		// 	webpackConfig.devServer.headers = {
		// 		'Access-Control-Allow-Origin': '*',
		// 		https: true,
		// 	};
		// }

		// Insert the rule to disable webpack 5 default resolve behavior
		webpackConfig.module.rules.unshift({
			test: /\.m?js/,
			resolve: {
				fullySpecified: false, // disable the behaviour
			},
		});

		if (!dev) {
			webpackConfig.optimization = {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							parse: {
								// we want uglify-js to parse ecma 8 code. However, we don't want it
								// to apply any minfication steps that turns valid ecma 5 code
								// into invalid ecma 5 code. This is why the 'compress' and 'output'
								// sections only apply transformations that are ecma 5 safe
								// https://github.com/facebook/create-react-app/pull/4234
								ecma: 8,
							},
							compress: {
								ecma: 5,
								warnings: false,
								// Disabled because of an issue with Uglify breaking seemingly valid code:
								// https://github.com/facebook/create-react-app/issues/2376
								// Pending further investigation:
								// https://github.com/mishoo/UglifyJS2/issues/2011
								comparisons: false,
								// Disabled because of an issue with Terser breaking valid code:
								// https://github.com/facebook/create-react-app/issues/5250
								// Pending futher investigation:
								// https://github.com/terser-js/terser/issues/120
								inline: 2,
							},
							mangle: {
								safari10: true,
							},
							output: {
								ecma: 5,
								comments: false,
								// Turned on because emoji and regex is not minified properly using default
								// https://github.com/facebook/create-react-app/issues/2488
								ascii_only: true,
							},
							toplevel: false,
							keep_fnames: true,
						},
						// @todo add flag for sourcemaps
						// sourceMap: true,
					}),
				],
			};
		}
		// if (webpackConfig.optimization && !dev) {
		// 	webpackConfig.optimization.minimize = true;
		// }
		//
		// if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
		// 	// Webpack 5 comes with the TerserPlugin out of the box, so remove it from the optimization.minimizer in the configuration
		// 	const terserIndex = webpackConfig.optimization.minimizer.findIndex((item) => item.constructor.name === 'TerserPlugin');
		// 	webpackConfig.optimization.minimizer.splice(terserIndex, 1);
		// }

		webpackConfig.resolve = {
			...webpackConfig.resolve,
			fallback: {
				url: require.resolve('url/'),
				util: require.resolve('util/'),
				path: require.resolve('path-browserify'),
				crypto: require.resolve('crypto-browserify'),
				process: require.resolve('process/browser'),
				stream: require.resolve('stream-browserify'),
			},
		};

		if (!dev && target === 'web') {
			webpackConfig.plugins.push(
				new Dotenv({
					defaults: true,
				}),
				/**
				 * Optimized all our css by Removing unused CSS using PurgeCSS
				 * Docs: https://www.purgecss.com
				 */
				new PurgecssPlugin({
					paths: glob.sync(path.resolve(__dirname, 'src/**/*'), {
						nodir: true,
					}),
					whitelist: [
						'special-label',
						'li',
						'react-tel-input',
						'dial-code',
						'open',
						'search',
						'up',
						'down',
						'arrow',
						'country',
						'highlight',
						'flag',
						'search-emoji',
						'search-box',
						'active',
						'cropper',
						'dashed',
						'point',
						'line',
						'preferred',
						'react-multi-carousel-list',
					].concat(countryList.split(',')),
					whitelistPatterns: [
						/^react-multi/,
						/^carousel/,
						/^react-tel/,
						/flag$/,
						/^country-list/,
						/^emoji/,
						/emoji$/,
						/^selected/,
						/^search/,
						/^country/,
						/^-/,
						/cropper$/,
						/^cropper/,
						/^line/,
						/line$/,
						/^point/,
						/point$/,
						/^dashed/,
						/dashed$/,
						/^rdr$/,
						/^rdr/,
						/^image-gallery-$/,
						/^image-gallery-/,
					],
					whitelistPatternsChildren: [],
				})
			);
		}

		return webpackConfig;
	},
};
