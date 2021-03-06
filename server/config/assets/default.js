export default {
	client: {
		img: [
			"client/img/*.jpg",
			"client/img/*.png",
			"client/img/*.gif",
			"client/img/*.svg",
		]
	},
	server: {
		gulpConfig: [
			"gulpfile.babel.js",
		],
		allJS: [
			"server.js",
			"config/**/*.js",
			"modules/*/server/**/*.js",
		],
		models: "modules/*/server/models/**/*.js",
		routes: [
			"modules/!(core)/server/routes/**/*.js",
			"modules/core/server/routes/**/*.js",
		],
		sockets: "modules/*/server/sockets/**/*.js",
		config: [
			"modules/*/server/config/*.js",
		],
		policies: "modules/*/server/policies/*.js",
		views: [
			"modules/*/server/views/*.html",
		],
	},
};
