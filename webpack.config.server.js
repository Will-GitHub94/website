const ExternalsPlugin = require("webpack-externals-plugin");

module.exports = {
	entry: `${__dirname}/server/server.js`,

	output: {
		path: `${__dirname}/dist/`,
		filename: "server.bundle.js",
	},

	target: "node",

	node: {
		__filename: true,
		__dirname: true,
	},

	resolve: {
		extensions: [
			".js",
			".jsx",
		],
		modules: [
			"client",
			"node_modules",
		],
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: [
						"react",
						"es2015",
						"stage-0",
					],
					plugins: [
						[
							"babel-plugin-webpack-loaders", {
								config: "./webpack.config.babel.js",
								verbose: false
							}
						]
					]
				},
			}, {
				test: /\.json$/,
				loader: "json-loader",
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: "url-loader",
				options: {
					limit: 8192
				}
			},
			{
				test: /\.less$/,
				exclude: /node_modules/,
				loaders: [
					"style-loader",
					"css-loader",
					"less-loader"
				]
			},
		],
	},
	plugins: [
		new ExternalsPlugin({
			type: "commonjs",
			include: `${__dirname}/node_modules/`,
		}),
	],
};
