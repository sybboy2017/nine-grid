const path = require('path');
const cwd = process.cwd();
module.exports = {
	production: {
		port: 3080,
		sslPort: 3081,
		assertRootPath: {test:path.resolve(cwd, 'target/test/static'),prod:path.resolve(cwd, 'target/prod/static'),local:path.resolve(cwd, 'target/local/static')},
		assetsPublicPath: '/static/',
		devtool: false,
		cssSourceMap: false,
	},
	development: {
		port: 3090,
		sslPort: 3091,
		mockApiPort:3092,
		assertRootPath: path.resolve(cwd, 'dist'),
		assetsPublicPath: '/',
		autoOpenBrowser: true,
		proxyTable: {},
		devtool: '#cheap-module-source-map',
		cssSourceMap: true,
	}
};
