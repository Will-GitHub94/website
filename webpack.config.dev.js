const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: {
		app: [
			"eventsource-polyfill",
			"webpack-hot-middleware/client",
			"webpack/hot/only-dev-server",
			"react-hot-loader/patch",
			"./client/index.jsx",
			"./client/styles/Main.scss"
		],
		vendor: [
			"react",
			"react-dom",
		],
	},
	target: "node",
	output: {
		path: `${__dirname}/dist/`,
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
		rules: [
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
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
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
		new ExtractTextPlugin({
			filename: "styles.css"
		}),
	]
};
