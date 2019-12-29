const path = require('path');
const fs = require('fs');
const express = require('express');
const cwd = process.cwd();


const addDevMiddlewares = (app, serverConfig, webpackConfig) => {
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const compiler = webpack(webpackConfig);
	const devMiddleware = webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath,
		silent: true,
		stats: 'errors-only'
	});
	const hotMiddleware = webpackHotMiddleware(compiler);
	compiler.plugin('compilation', (compilation) => {
		compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
			hotMiddleware.publish({
				action: 'reload'
			});
			cb(null, data);
		});
	});
	app.use(devMiddleware);
	app.use(hotMiddleware);
};

module.exports = (app, serverConfig) => {
	const isDev = process.env.NODE_ENV === 'development';
	if (!isDev) {
		app.get('*', (req, res) => {
			fs.readFile(path.resolve(cwd, req.path.replace(/\//g, '')), (err, file) => {
				if (err) {
					res.sendStatus(404);
				} else {
					res.send(file.toString());
				}
			});
		});
	} else {
		const webpackConfig = require(path.resolve(cwd, 'scripts/webpack/webpack.dev'));
		app.use('/static', express.static(path.resolve(cwd, 'static')));
		addDevMiddlewares(app, serverConfig, webpackConfig);
	}

	return app;
};