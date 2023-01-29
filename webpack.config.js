const path = require('path');

module.exports = {
	mode: "production",
	performance: {
		hints: false, // ignore webpack asset size warning
	},
	entry: "./js/App.js",
	output: {
		path: `${__dirname}/dist`,
		filename: "main.js"
	},
	externals: { "t3d": "t3d" },
	resolve: {
		alias: {
			"t3d-effect-composer": path.resolve(__dirname, "./libs/t3d-effect-composer/build/t3d.effectcomposer.module.js")
		}
	},
	module: {
		rules: [{
			test: /\.hbs$/,
			use: 'handlebars-loader'
		}]
	}
};