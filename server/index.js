const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const chalk = require('chalk');
const proxy = require('http-proxy-middleware');

const setup = require('./middlewares/frontendMiddleware');
const setupMocker = require('./middlewares/apiMocker');

const env = process.env.NODE_ENV;

const config = require('./config')[env];

const app = express();
app.use(compression());
app.use(config.assetsPublicPath, express.static(config.assertRootPath));

/**
 * 设置请求代理
 */

// app.use('/inc', (req, res) => {
//     console.log('method', req.method);
//     console.log('path', req.path);
//     http.request(options, callback)
// });
app.use('/inc', proxy({
	target: 'https://m.immomo.com',
	changeOrigin: true
}));
app.use('/activity/*', proxy({
	target: 'https://m.immomo.com',
	changeOrigin: true
}));
app.use('/mk/*', proxy({
	target: 'https://m.immomo.com',
	changeOrigin: true
}));


/**
 * 配置中间件
 */
setup(app, config);

if (process.argv[2] && process.argv[2] === 'mocker') {
	setupMocker(app);
}
const options = {
	key: fs.readFileSync(path.resolve(__dirname, 'ssl/private.pem')),
	cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.crt'))
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
const port = config.port;
const sslPort = config.sslPort;
httpServer.listen(port, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log();
	console.log(`HTTP Server is running on: http://local.m.immomo.com:${port}`, chalk.green.bold(env));
});

httpsServer.listen(sslPort, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log(`HTTPS Server is running on: https://local.m.immomo.com:${sslPort}`, chalk.green.bold(env));
});

