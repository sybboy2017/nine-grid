module.exports = {
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true,
			"experimentalObjectRestSpread": true
		}
	},
	"settings": {
		"html/html-extensions": [
			".html",
			".vue"
		]
	},
	"env": {
		"browser": true,
		"node": true
	},
	"extends": "airbnb-base",
	"rules": {
		"func-names": 0,
		"indent": ["error", 4],
		"arrow-body-style": ["error", "as-needed"],
        "no-underscore-dangle": 0,

    }
}
