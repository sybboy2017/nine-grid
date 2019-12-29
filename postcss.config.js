// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
	plugins: [
		require('postcss-smart-import')(),
		require('postcss-cssnext')({
			warnForDuplicates: false,
			browsers: [
				'Chrome >= 28',
				'Firefox >= 28',
				'Edge >= 12',
				'Explorer >= 9',
				'Safari >= 5.1',
				'iOS >= 7',
				'Android >= 5',
				'ExplorerMobile >= 11',
				'ChromeAndroid >= 54',
				'FirefoxAndroid >= 50',
				'UCAndroid >= 11',
				'OperaMobile >= 12.1',
				'BlackBerry >= 10',
				'Samsung >= 4'
			]
		}),
		require('precss')(),
		require('postcss-px-to-viewport')({
			viewportWidth: 750,
			viewportHeight: 1334,
			unitPrecision: 5,
			viewportUnit: 'vw',
			selectorBlackList: [],
			minPixelValue: 1,
			mediaQuery: false
		}),
	],
}