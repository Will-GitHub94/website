import { clone, merge } from "lodash";
import * as mongoose from "mongoose";
import * as chalk from "chalk";

import config from "../config";

const skipCollection = (skipWhen, Model) => {
	return new Promise(((resolve, reject) => {
		if (!skipWhen) {
			return resolve(false);
		}

		Model
			.find(skipWhen)
			.exec((err, results) => {
				if (err) {
					return reject(err);
				}

				if (results && results.length) {
					return resolve(true);
				}

				return resolve(false);
			});
	}));
};

const seed = (collection, options) => {
	// Merge options with collection options
	options = merge(options || {}, collection.options || {});

	return new Promise(((resolve, reject) => {
		const Model = mongoose.model(collection.model);
		const { docs } = collection;

		const skipWhen = collection.skip ? collection.skip.when : null;

		if (!Model.seed) {
			return reject(new Error(`Database Seeding: Invalid Model Configuration - ${collection.model}.seed()`
										+ "not implemented"));
		}

		if (!docs || !docs.length) {
			return resolve();
		}


		const onComplete = (responses) => {
			if (options.logResults) {
				responses.forEach((response) => {
					if (response.message) {
						console.log(chalk.magenta(response.message));
					}
				});
			}
			return resolve();
		};

		const onError = (err) => {
			return reject(err);
		};

		const seedDocuments = (skipCol) => {
			return new Promise(((resolve, reject) => {
				if (skipCol) {
					return onComplete([{
						message: chalk.yellow(`Database Seeding: ${collection.model}`
																	+ "collection skipped"),
					}]);
				}

				const workload = docs
					.filter((doc) => {
						return doc.data;
					})
					.map((doc) => {
						return Model.seed(doc.data, { overwrite: doc.overwrite });
					});

				Promise.all(workload)
					.then(onComplete)
					.catch(onError);
			}));
		};

		// First check if we should skip this collection
		// based on the collection"s "skip.when" option.
		// NOTE: If it exists, "skip.when" should be a qualified
		// Mongoose query that will be used with Model.find().
		skipCollection(skipWhen, Model)
			.then(seedDocuments)
			.then(() => {
				return resolve();
			})
			.catch((err) => {
				return reject(err);
			});
	}));
};

const start = (seedConfig) => {
	return new Promise(((resolve, reject) => {
		seedConfig = seedConfig || {};

		const options = seedConfig.options || (config.seedDB ? clone(config.seedDB.options, true) : {});
		const collections = seedConfig.collections || (config.seedDB ? clone(config.seedDB.collections, true) : []);

		if (!collections.length) {
			return resolve();
		}

		const seeds = collections
			.filter((collection) => {
				return collection.model;
			});

		const onSuccessComplete = () => {
			if (options.logResults) {
				console.log();
				console.log(chalk.bold.green("Database Seeding: Mongo Seed complete!"));
				console.log();
			}

			return resolve();
		};

		const onError = (err) => {
			if (options.logResults) {
				console.log();
				console.log(chalk.bold.red("Database Seeding: Mongo Seed Failed!"));
				console.log(chalk.bold.red(`Database Seeding: ${err}`));
				console.log();
			}

			return reject(err);
		};

		// Use the reduction pattern to ensure we process seeding in desired order.
		seeds.reduce((p, item) => {
			return p.then(() => {
				return seed(item, options);
			});
		}, Promise.resolve()) // start with resolved promise for initial previous (p) item
			.then(onSuccessComplete)
			.catch(onError);
	}));
};

export default start;
