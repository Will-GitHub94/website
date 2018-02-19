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
				exclude: /node_modules/,
				// This loader will extract text from a bundle into a separate file (the clue is in the name)
				loader: ExtractTextPlugin.extract({
					// This will inject a '<style>' element into the DOM (not the virtual DOM) and will, therefore,
					// be omitted if doing server-side rendering
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
		// This will bundle the stylesheets into this file
		// In this case, 'styles.css'
		new ExtractTextPlugin({
			filename: "[name].css",
			disable: process.env.NODE_ENV === "development"
		}),
	]
};
