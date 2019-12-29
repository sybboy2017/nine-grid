const apiMocker = require('webpack-api-mocker');
const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const chalk = require('chalk');
var bodyParser=require('body-parser');


module.exports = (app) => {
	const env = process.env.NODE_ENV;
	const config = require('../config')[env];

	const expressApp = express();
	expressApp.use(bodyParser.urlencoded({extended:true}));
	const mockerPath=path.resolve('./mocker/index.js');
	apiMocker(expressApp, mockerPath)

	const mocker = require(mockerPath);
	const apiPath= Object.keys(mocker).map((current)=>{return current.split(/\s+/)[1]})
	apiPath.forEach((current)=>{
		app.use(current, proxy({
			target: 'http://local.m.immomo.com:3092',
			changeOrigin: true
		}));
	})

	const mockApiPort = config.mockApiPort;

	expressApp.listen(mockApiPort, (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(`Mock API is running on: http://local.m.immomo.com:${mockApiPort}`, chalk.green.bold(env));
	});

};
