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
	module: {
		rules: [{
			test: /\.hbs$/,
			use: 'handlebars-loader'
		}]
	}
};