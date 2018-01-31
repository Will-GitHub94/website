/**
 * Module dependencies.
 */
import chalk from "chalk";

import config from "../config";
import mongooseService from "./mongoose";
import express from "./express";
import seed from "./mongo-seed";

const seedDB = () => {
	if (config.seedDB && config.seed) {
		console.log(chalk.bold.red("Warning:  Database seeding is turned on"));
		seed.start();
	}
};

const init = (callback) => {
	mongooseService.connect((db) => {
		// Initialize Models
		mongooseService.loadModels(seedDB);

		// Initialize express
		const app = express.init(db);
		if (callback) {
			callback(app, db, config);
		}
	});
};

const start = (callback) => {
	init((app, db, conf) => {
		// Start the app by listening on <port> at <host>
		app.listen(conf.port, conf.host, () => {
			// Create server URL
			const server = `${(process.env.NODE_ENV === "secure" ? "https://" : "http://")
								+ conf.host}:${conf.port}`;
			// Logging initialization
			console.log("--");
			console.log(chalk.green(conf.app.title));
			console.log();
			console.log(chalk.green(`Environment:     ${process.env.NODE_ENV}`));
			console.log(chalk.green(`Server:          ${server}`));
			console.log(chalk.green(`Database:        ${conf.db.uri}`));
			console.log(chalk.green(`App version:     ${conf.meanjs.version}`));
			if (conf.meanjs["meanjs-version"]) {
				console.log(chalk.green(`MEAN.JS version: ${conf.meanjs["meanjs-version"]}`));
			}
			console.log("--");

			if (callback) {
				callback(app, db, conf);
			}
		});
	});
};

export default start;
