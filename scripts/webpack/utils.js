exports.cssLoaders = (options = {}) => {
	const cssLoader = {
		loader: 'css-loader',
		options: {
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: options.sourceMap
		}
	};
	// generate loader string to be used with extract text plugin
	function generateLoaders(loader = '', loaderOptions) {
		const loaders = [cssLoader];
		loaders.push({
			loader: 'postcss-loader',
			options: {
				sourceMap: options.sourceMap,
			},
		});
		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			});
		}
		return ['vue-style-loader'].concat(loaders);
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', {
			indentedSyntax: true
		}),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	};
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = (options) => {
	const loaders = exports.cssLoaders(options);
	return Object.keys(loaders).map((extension) => {
		return {
			test: new RegExp('\\.' + extension + '$'),
			use: loaders[extension]
		};
	});
};
