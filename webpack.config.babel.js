const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	output: {
		publicPath: "/",
		libraryTarget: "commonjs2",
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
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						"css-loader",
						"sass-loader"
					]
				}),
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			},
			{
				test: /\.(jpeg|png|jpg|gif)$/,
				loader: "url-loader",
				options: {
					limit: 10000
				}
			},
		],
	},
	plugins: [
		new ExtractTextPlugin({
			filename: "styles.css"
		})
	]
};
