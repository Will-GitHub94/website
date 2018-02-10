const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = {
	entry: {
		app: [
			'eventsource-polyfill',
			'webpack-hot-middleware/client',
			'webpack/hot/only-dev-server',
			'react-hot-loader/patch',
			'./client/index.js',
		],
		vendor: [
			'react',
			'react-dom',
		],
	},
	target: "node",
	output: {
		path: `${__dirname}/dist/`,
		filename: "app.js",
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
				test: /\.js*$/,
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
			{
				test: /\.less$/,
				exclude: /node_modules/,
				loaders: [
					"style-loader",
					"css-loader",
					"less-loader"
				]
			}
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity,
			filename: 'vendor.js',
		}),
		new webpack.DefinePlugin({
			'process.env': {
				CLIENT: JSON.stringify(true),
				'NODE_ENV': JSON.stringify('development'),
			}
		}),
	]
};
