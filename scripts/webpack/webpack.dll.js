const path = require('path');
const webpack = require('webpack');

const vendors = [
	'vue'
];

module.exports = {
	context: process.cwd(),
	entry: {
		vendor: vendors
	},
	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: 'lib/[name].dll.js',
		library: '[name]_[hash]'
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]_[hash]',
			path: 'manifest.json'
		})
	]

};
