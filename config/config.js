/**
 * Module dependencies.
 */
import { isArray, merge, union, isString } from "lodash";
import chalk from "chalk";
import glob from "glob";
import fs from "fs";
import path from "path";

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns, excludes) => {
	// URL paths regex
	const urlRegex = new RegExp("^(?:[a-z]+:)?\\/\\/", "i");

	// The output array
	let output = [];
	let thisFile;

	// If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
	if (isArray(globPatterns)) {
		globPatterns.forEach((globPattern) => {
			output = union(output, getGlobbedPaths(globPattern, excludes));
		});
	} else if (isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			let files = glob.sync(globPatterns);
			if (excludes) {
				files = files.map((file) => {
					if (isArray(excludes)) {
						Object.keys(excludes).forEach((i) => {
							if (Object.prototype.hasOwnProperty.call(excludes, i)) {
								thisFile = file.replace(excludes[i], "");
							}
						});
					} else {
						thisFile = file.replace(excludes, "");
					}
					return thisFile;
				});
			}
			output = union(output, files);
		}
	}
	return output;
};

/**
 * Validate NODE_ENV existence
 */
const validateEnvironmentVariable = () => {
	const environmentFiles = glob.sync(`./config/env/${process.env.NODE_ENV}.js`);
	console.log();
	if (!environmentFiles.length) {
		if (process.env.NODE_ENV) {
			console.error(chalk.red(`+ Error: No configuration file found for "${process.env.NODE_ENV}" environment `
										+ "using development instead"));
		} else {
			console.error(chalk.red("+ Error: NODE_ENV is not defined! Using default development environment"));
		}
		process.env.NODE_ENV = "development";
	}
	// Reset console color
	console.log(chalk.white(""));
};

/** Validate config.domain is set
 */
const validateDomainIsSet = (config) => {
	if (!config.domain) {
		console.log(chalk.red("+ Important warning: config.domain is empty. It should be set to the fully qualified"
								+ " domain of the app."));
	}
};

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
const validateSecureMode = (config) => {
	if (!config.secure || config.secure.ssl !== true) {
		return true;
	}

	const privateKey = fs.existsSync(path.resolve(config.secure.privateKey));
	const certificate = fs.existsSync(path.resolve(config.secure.certificate));

	if (!privateKey || !certificate) {
		console.log(chalk.red("+ Error: Certificate file or key file is missing, falling back to non-SSL mode"));
		console.log(chalk.red("  To create them, simply run the following from your shell:"
								+ " sh ./scripts/generate-ssl-certs.sh"));
		console.log();
		config.secure.ssl = false;
	}
};

/**
 * Validate Session Secret parameter is not set to default in production
 */
const validateSessionSecret = (config, testing) => {
	if (process.env.NODE_ENV !== "production") {
		return true;
	}

	if (config.sessionSecret === "MEAN") {
		if (!testing) {
			console.log(chalk.red("+ WARNING: It is strongly recommended that you change sessionSecret config while"
									+ "running in production!"));
			console.log(chalk.red("  Please add `sessionSecret: process.env.SESSION_SECRET || "
									+ "\"super amazing secret\"` to "));
			console.log(chalk.red("  `config/env/production.js` or `config/env/local.js`"));
			console.log();
		}
		return false;
	}
	return true;
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFolders = (config) => {
	// Appending files
	config.folders = {
		server: {},
	};
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = (config, assets) => {
	// Appending files
	config.files = {
		server: {},
	};

	// Setting Globbed model files
	config.files.server.models = getGlobbedPaths(assets.server.models);

	// Setting Globbed route files
	config.files.server.routes = getGlobbedPaths(assets.server.routes);

	// Setting Globbed config files
	config.files.server.configs = getGlobbedPaths(assets.server.config);

	// Setting Globbed socket files
	config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

	// Setting Globbed policies files
	config.files.server.policies = getGlobbedPaths(assets.server.policies);
};

/**
 * Initialize global configuration
 */
export default () => {
	// Validate NODE_ENV existence
	validateEnvironmentVariable();

	// Get the default assets
	const defaultAssets = require(path.join(process.cwd(), "config/assets/default"));

	// Get the current assets
	const environmentAssets = require(path.join(process.cwd(), "config/assets/", process.env.NODE_ENV)) || {};

	// Merge assets
	const assets = merge(defaultAssets, environmentAssets);

	// Get the default config
	const defaultConfig = require(path.join(process.cwd(), "config/env/default"));

	// Get the current config
	const environmentConfig = require(path.join(process.cwd(), "config/env/", process.env.NODE_ENV)) || {};

	// Merge config files
	let config = merge(defaultConfig, environmentConfig);

	// read package.json for MEAN.JS project information
	config.meanjs = require(path.resolve("./package.json"));

	// Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings
	// present in the local configuration.
	config = merge(config, (fs.existsSync(path.join(process.cwd(), `config/env/local-${process.env.NODE_ENV}.js`))
		&& require(path.join(process.cwd(), `config/env/local-${process.env.NODE_ENV}.js`))) || {});

	// Initialize global globbed files
	initGlobalConfigFiles(config, assets);

	// Initialize global globbed folders
	initGlobalConfigFolders(config);

	// Validate Secure SSL mode can be used
	validateSecureMode(config);

	// Validate session secret
	validateSessionSecret(config);

	// Print a warning if config.domain is not set
	validateDomainIsSet(config);

	// Expose configuration utilities
	config.utils = {
		getGlobbedPaths,
		validateSessionSecret,
	};

	return config;
};
