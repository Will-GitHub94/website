const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	devtool: "cheap-module-eval-source-map",
	entry: {
		app: [
			"eventsource-polyfill",
			"webpack-hot-middleware/client",
			"webpack/hot/only-dev-server",
			"react-hot-loader/patch",
			"./client/index.jsx",
		],
		vendor: [
			"react",
			"react-dom",
		],
	},
	output: {
		path: `${__dirname}/dist/client`,
		filename: "app.min.js",
		publicPath: "http://0.0.0.0:8000/"
	},
	resolve: {
		extensions: [
			".js",
			".jsx"
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
				test: /\.jsx*$/,
				exclude: /node_modules/,
				loader: "babel-loader"
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
				test: /\.scss$/,
				loader: 'style-loader!css-loader?module&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader',
				exclude: /node_modules/
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: Infinity,
			filename: "vendor.js",
		}),
		new webpack.DefinePlugin({
			"process.env": {
				CLIENT: JSON.stringify(true),
				NODE_ENV: JSON.stringify("development"),
				BROWSER: JSON.stringify(true)
			}
		}),
	]
};
