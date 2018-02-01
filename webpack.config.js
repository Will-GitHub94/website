const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
	entry: "./server.js",
	target: "node",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "server.bundle.js"
	},
	resolve: {
		extensions: [
			".js"
		],
		modules: [
			"node_modules"
		],
	},
	externals: [
		nodeExternals()
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: [
						"es2015"
					],
				},
			}, {
				test: /\.json$/,
				loader: "json-loader",
			},
		],
	}
};
