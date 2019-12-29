const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpack = require('./webpack.base');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const cwd = process.cwd();
const NODE_ENV = process.env.NODE_ENV;
const ENV_CONFIG = process.env.env_config;

const config = require(path.resolve(cwd, 'server/config'))[NODE_ENV];

const {
    getPluins,
    resources,
    baseConfig
} = baseWebpack;
const {
    entries,
} = resources;

let cdnDomain,bid;
if (ENV_CONFIG === 'test') {
	const fepDomains = require(path.resolve(cwd, '.cdn-domains.js'));
	cdnDomain = 'https://' + fepDomains.testCdnDomain;
	bid = fepDomains.bid;
} else if (ENV_CONFIG === 'prod') {
	const fepDomains = require(path.resolve(cwd, '.cdn-domains.js'));
	cdnDomain = 'https://' + fepDomains.cdnDomain;
	bid = fepDomains.bid;
} else {
	cdnDomain = '.';
	bid = 0;
}
const prodWebpackConfig = merge(baseConfig, {
	entry: entries,
	output: {
		path: config.assertRootPath[ENV_CONFIG],
		filename: '[name].[chunkhash].js' + `?_bid=${bid}`,
		publicPath: cdnDomain + config.assetsPublicPath
	},
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: `img/[name].[hash:8].[ext]?_bid=${bid}`
					}
				}]
			}
		]
	},
	plugins: [
		...getPluins.styleExtHtmlPlugins,
		new HtmlWebpackExcludeAssetsPlugin(),
		new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
			beautify: false,
            // 删除所有的注释
			comments: false,
			sourceMap: false,
			compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
				warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
				drop_console: true,
                // 内嵌定义了但是只用到一次的变量
				collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
				reduce_vars: true
			}
		})

	]
});
module.exports = prodWebpackConfig;
