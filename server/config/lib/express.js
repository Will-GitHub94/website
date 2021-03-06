/**
 * Module dependencies.
 */
import bodyParser from "body-parser";
import session from "express-session";
import connectMongo from "connect-mongo";
import compression from "compression";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import flash from "connect-flash";
import hbs from "express-hbs";
import path from "path";
import { has } from "lodash";
import lusca from "lusca";
import express from "express";
import morgan from "morgan";
import favicon from "serve-favicon";

import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import React from "react";

import webpackConfig from "../../../webpack.config.dev";
import App from "../../../client/App";

import config from "../config";
import logger from "./logger";

const MongoStore = connectMongo(session);

/**
 * Initialize local variables
 */
const initLocalVariables = (app) => {
	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	if (config.secure && config.secure.ssl === true) {
		app.locals.secure = config.secure.ssl;
	}
	app.locals.keywords = config.app.keywords;
	app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
	app.locals.facebookAppId = config.facebook.clientID;
	app.locals.twitterUsername = config.twitter.username;
	app.locals.livereload = config.livereload;
	app.locals.logo = config.logo;
	app.locals.favicon = config.favicon;
	app.locals.env = process.env.NODE_ENV;
	app.locals.domain = config.domain;

	// Passing the request url to environment locals
	app.use((req, res, next) => {
		res.locals.host = `${req.protocol}://${req.hostname}`;
		res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
		next();
	});
};

const initWebpackMiddleware = (app) => {
	const isDevMode = process.env.NODE_ENV === "development";

	if (isDevMode) {
		const compiler = webpack(webpackConfig);

		app.use(webpackDevMiddleware(compiler, {
			noInfo: true,
			publicPath: webpackConfig.output.publicPath
		}));
		app.use(webpackHotMiddleware(compiler));
	}
};

const initCompressionMiddleware = (app) => {
	app.use(compression({
		filter(req, res) {
			return (/json|text|javascript|css|font|svg/).test(res.getHeader("Content-Type"));
		},
		level: 9,
	}));
};

const initLoggingMiddleware = (app) => {
	if (has(config, "log.format")) {
		app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
	}
};

const initBodyParsingMiddleware = (app) => {
	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Add the cookie parser and flash middleware
	app.use(cookieParser());
	app.use(flash());
};

const initFaviconMiddleware = (app) => {
	app.use(favicon(app.locals.favicon));
};

/**
 * Initialize application middleware
 */
const initMiddleware = (app) => {
	const isDevMode = process.env.NODE_ENV === "development";
	const isProdMode = process.env.NODE_ENV === "production";

	initCompressionMiddleware(app);

	initLoggingMiddleware(app);

	// Environment dependent middleware
	if (isDevMode) {
		// Disable views cache
		app.set("view cache", false);
	} else if (isProdMode) {
		app.locals.cache = "memory";
	}

	initBodyParsingMiddleware(app);

	initWebpackMiddleware(app);

	initFaviconMiddleware(app);
};

/**
 * Configure view engine
 */
const initViewEngine = (app) => {
	app.engine("server.view.html", hbs.express4({
		extname: ".server.view.html",
	}));
	app.set("view engine", "server.view.html");
	app.set("views", path.resolve("./"));
};

/**
 * Configure Express session
 */
const initSession = (app, db) => {
	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		cookie: {
			maxAge: config.sessionCookie.maxAge,
			httpOnly: config.sessionCookie.httpOnly,
			secure: config.sessionCookie.secure && config.secure.ssl,
		},
		name: config.sessionKey,
		store: new MongoStore({
			db,
			collection: config.sessionCollection,
			url: config.db.uri
		}),
	}));

	// Add Lusca CSRF Middleware
	app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
const initModulesConfiguration = (app) => {
	config.files.server.configs.forEach((configPath) => {
		require(path.resolve(configPath)).default(app);
	});
};

/**
 * Configure Helmet headers configuration for security
 */
const initHelmetHeaders = (app) => {
	// six months expiration period specified in seconds
	const SIX_MONTHS = 15778476;

	app.use(helmet.frameguard());
	app.use(helmet.xssFilter());
	app.use(helmet.noSniff());
	app.use(helmet.ieNoOpen());
	app.use(helmet.hsts({
		maxAge: SIX_MONTHS,
		includeSubdomains: true,
		force: true,
	}));
	app.disable("x-powered-by");
};

const initServerSideRendering = (app) => {
	app.use((req, res, next) => {
		const context = {};

		const html = ReactDOMServer.renderToString(<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>);

		res.status(200).send(`
                <!DOCTYPE html>
                <html>
                	<head>
                		<title>Will Ashworth</title>
                		<link rel="stylesheet"href="/app.css" type="text/css"/>
                	</head>
                	<body>
                		<div id="app">${html}</div>
                	</body>
                </html>
        `);
	});
};

/**
 * Configure the modules ACL policies
 */
const initModulesServerPolicies = () => {
	// Globbing policy files
	config.files.server.policies.forEach((policyPath) => {
		require(path.resolve(policyPath)).default.invokeRolesPolicies();
	});
};

/**
 * Configure the modules server routes
 */
const initModulesServerRoutes = (app) => {
	// Globbing routing files
	config.files.server.routes.forEach((routePath) => {
		require(path.resolve(routePath)).default(app);
	});
};

/**
 * Configure error handling
 */
const initErrorRoutes = (app) => {
	app.use((err, req, res, next) => {
		// If the error object doesn"t exists
		if (!err) {
			return next();
		}

		// Log it
		console.error(err.stack);

		// Redirect to error page
		res.redirect("/server-error");
	});
};

/**
 * Configure Socket.io
 */
const configureSocketIO = (app, db) => {
	// Load the Socket.io configuration
	const server = require("./socket.io").default(app, db);

	// Return server object
	return server;
};

const initServeStaticFiles = (app) => {
	app.use(express.static(path.resolve(__dirname, "../dist/client")));
};

/**
 * Initialize the Express application
 */
const init = (db) => {
	// Initialize express app
	let app = express();

	// Initialize local variables
	initLocalVariables(app);

	// Initialize Express middleware
	initMiddleware(app);

	// Initialize Express view engine
	initViewEngine(app);

	// Initialize Helmet security headers
	initHelmetHeaders(app);

	// Initialize Express session
	initSession(app, db);

	// Initialize Modules configuration
	initModulesConfiguration(app);

	// Initialise Server Side Rendering based on routes matched by React-router.
	initServerSideRendering(app);

	// Initialize modules server authorization policies
	initModulesServerPolicies();

	// Initialize modules server routes
	initModulesServerRoutes(app);

	// Initialize error routes
	initErrorRoutes(app);

	initServeStaticFiles(app);

	// Configure Socket.io
	app = configureSocketIO(app, db);

	return app;
};

export default {
	init
};
