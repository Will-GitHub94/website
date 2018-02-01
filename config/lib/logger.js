import { clone, has, includes } from "lodash";
import chalk from "chalk";
import fs from "fs";
import winston from "winston";

import config from "../config";

// list of valid formats for the logging
const validFormats = [
	"combined",
	"common",
	"dev",
	"short",
	"tiny",
];

// Instantiating the default winston application logger with the Console
// transport
const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			level: "info",
			colorize: true,
			showLevel: true,
			handleExceptions: true,
			humanReadableUnhandledException: true,
		}),
	],
	exitOnError: false,
});

// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan"s stream
// option to log all HTTP requests to a file
logger.stream = {
	write(msg) {
		logger.info(msg);
	},
};

/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
logger.getLogOptions = () => {
	const conf = clone(config.initGlobalConfig(), true);
	const configFileLogger = conf.default.log.fileLogger;

	if (!has(conf, "log.fileLogger.directoryPath") || !has(conf, "log.fileLogger.fileName")) {
		console.log("unable to find logging file configuration");
		return false;
	}

	const logPath = `${configFileLogger.directoryPath}/${configFileLogger.fileName}`;

	return {
		level: "debug",
		colorize: false,
		filename: logPath,
		timestamp: true,
		maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
		maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
		json: (has(configFileLogger, "json")) ? configFileLogger.json : false,
		eol: "\n",
		tailable: true,
		showLevel: true,
		handleExceptions: true,
		humanReadableUnhandledException: true,
	};
};

/**
 * Instantiate a winston"s File transport for disk file logging
 *
 */
logger.setupFileLogger = () => {
	const fileLoggerTransport = logger.getLogOptions();
	if (!fileLoggerTransport) {
		return false;
	}

	try {
		// Check first if the configured path is writable and only then
		// instantiate the file logging transport
		if (fs.openSync(fileLoggerTransport.filename, "a+")) {
			logger.add(winston.transports.File, fileLoggerTransport);
		}

		return true;
	} catch (err) {
		if (process.env.NODE_ENV !== "test") {
			console.log();
			console.log(chalk.red("An error has occured during the creation of the File transport logger."));
			console.log(chalk.red(err));
			console.log();
		}

		return false;
	}
};

/**
 * The options to use with morgan logger
 *
 * Returns a log.options object with a writable stream based on winston
 * file logging transport (if available)
 */
logger.getMorganOptions = () => {
	return {
		stream: logger.stream,
	};
};

/**
 * The format to use with the logger
 *
 * Returns the log.format option set in the current environment configuration
 */
logger.getLogFormat = () => {
	let format = config.log && config.log.format ? config.log.format.toString() : "combined";

	// make sure we have a valid format
	if (!includes(validFormats, format)) {
		format = "combined";

		if (process.env.NODE_ENV !== "test") {
			console.log();
			console.log(chalk.yellow("Warning: An invalid format was provided. The logger will use the default"
										+ `format of "${format}"`));
			console.log();
		}
	}
	return format;
};

logger.setupFileLogger();

module.exports = logger;
