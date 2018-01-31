/**
 * Module dependencies.
 */

import { forEach, union } from "lodash";
import fs from "fs";
import glob from "glob";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import runSequence from "run-sequence";
import pngquant from "imagemin-pngquant";
import wiredep from "wiredep";
import path from "path";
import del from "del";
import semver from "semver";

import defaultAssets from "./config/assets/default";
import testAssets from "./config/assets/test";
import testConfig from "./config/env/test";
import mongooseService from "./config/lib/mongoose";
import seed from "./config/lib/mongo-seed";

const plugins = gulpLoadPlugins({
	rename: {
		"gulp-angular-templatecache": "templateCache",
	},
});

// Local settings
let changedTestFiles = [];

// Set NODE_ENV to "test"
gulp.task("env:test", () => {
	process.env.NODE_ENV = "test";
});

// Set NODE_ENV to "development"
gulp.task("env:dev", () => {
	process.env.NODE_ENV = "development";
});

// Set NODE_ENV to "production"
gulp.task("env:prod", () => {
	process.env.NODE_ENV = "production";
});

// Nodemon task
gulp.task("nodemon", () => {
	// Node.js v7 and newer use different debug argument
	const debugArgument = semver.satisfies(process.versions.node, ">=7.0.0") ? "--inspect" : "--debug";

	return plugins.nodemon({
		script: "server.js",
		nodeArgs: [debugArgument],
		ext: "js,html",
		verbose: true,
		watch: union(
			defaultAssets.server.views,
			defaultAssets.server.allJS,
			defaultAssets.server.config
		),
	});
});

// Nodemon task without verbosity or debugging
gulp.task("nodemon-nodebug", () => {
	return plugins.nodemon({
		script: "server.js",
		ext: "js,html",
		watch: union(
			defaultAssets.server.views,
			defaultAssets.server.allJS,
			defaultAssets.server.config
		),
	});
});

// Watch Files For Changes
gulp.task("watch", () => {
	// Start livereload
	plugins.refresh.listen();

	// Add watch rules
	gulp.watch(defaultAssets.server.views).on("change", plugins.refresh.changed);
	gulp.watch(defaultAssets.server.allJS, [
		"eslint"
	]).on("change", plugins.refresh.changed);

	if (process.env.NODE_ENV === "production") {
		gulp.watch(defaultAssets.server.gulpConfig, [
			"templatecache",
			"eslint",
		]);
	} else {
		gulp.watch(defaultAssets.server.gulpConfig, [
			"eslint"
		]);
	}
});

// Watch server test files
gulp.task("watch:server:run-tests", () => {
	// Start livereload
	plugins.refresh.listen();

	// Add Server Test file rules
	gulp.watch([
		testAssets.tests.server,
		defaultAssets.server.allJS,
	], ["test:server"]).on("change", (file) => {
		changedTestFiles = [];

		// iterate through server test glob patterns
		forEach(testAssets.tests.server, (pattern) => {
			// determine if the changed (watched) file is a server test
			forEach(glob.sync(pattern), (f) => {
				const filePath = path.resolve(f);

				if (filePath === path.resolve(file.path)) {
					changedTestFiles.push(f);
					plugins.refresh.changed(f);
				}
			});
		});
	});
});

// ESLint JS linting task
gulp.task("eslint", () => {
	const assets = union(
		defaultAssets.server.gulpConfig,
		defaultAssets.server.allJS,
		testAssets.tests.server,
		testAssets.tests.e2e
	);

	return gulp.src(assets)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format());
});

// wiredep task to default
gulp.task("wiredep", () => {
	return gulp.src("config/assets/default.js")
		.pipe(wiredep.stream({
			ignorePath: "../../",
		}))
		.pipe(gulp.dest("config/assets/"));
});

// wiredep task to production
gulp.task("wiredep:prod", () => {
	return gulp.src("config/assets/production.js")
		.pipe(wiredep.stream({
			ignorePath: "../../",
			fileTypes: {
				js: {
					replace: {
						css: (filePath) => {
							const minFilePath = filePath.replace(".css", ".min.css");
							const fullPath = path.join(process.cwd(), minFilePath);

							if (!fs.existsSync(fullPath)) {
								return `${filePath},`;
							}
							return `${minFilePath},`;
						},
						js: (filePath) => {
							const minFilePath = filePath.replace(".js", ".min.js");
							const fullPath = path.join(process.cwd(), minFilePath);

							if (!fs.existsSync(fullPath)) {
								return `${filePath},`;
							}
							return `${minFilePath},`;
						}
					},
				},
			},
		}))
		.pipe(gulp.dest("config/assets/"));
});

// Copy local development environment config example
gulp.task("copyLocalEnvConfig", () => {
	const src = [];
	const renameTo = "local-development.js";

	// only add the copy source if our destination file doesn"t already exist
	if (!fs.existsSync(`config/env/${renameTo}`)) {
		src.push("config/env/local.example.js");
	}

	return gulp.src(src)
		.pipe(plugins.rename(renameTo))
		.pipe(gulp.dest("config/env"));
});

// Mocha tests task
gulp.task("mocha", (done) => {
	const testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests.server;
	let error;

	// Connect mongoose
	mongooseService.connect((db) => {
		// Load mongoose models
		mongooseService.loadModels();

		gulp.src(testSuites)
			.pipe(plugins.mocha({
				reporter: "spec",
				timeout: 10000
			}))
			.on("error", (err) => {
				// If an error occurs, save it
				error = err;
			})
			.on("end", () => {
				mongooseService.disconnect((err) => {
					if (err) {
						console.log("Error disconnecting from database");
						console.log(err);
					}

					return done(error);
				});
			});
	});
});

// Prepare istanbul coverage test
gulp.task("pre-test", () => {
	// Display coverage for all server JavaScript files
	return gulp.src(defaultAssets.server.allJS)
		// Covering files
		.pipe(plugins.istanbul())
		// Force `require` to return covered files
		.pipe(plugins.istanbul.hookRequire());
});

// Run istanbul test and write report
gulp.task("mocha:coverage", ["pre-test", "mocha"], () => {
	const testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests.server;

	return gulp.src(testSuites)
		.pipe(plugins.istanbul.writeReports({
			reportOpts: {
				dir: "./coverage/server",
			},
		}));
});

// Drops the MongoDB database, used in e2e testing
gulp.task("dropdb", (done) => {
	mongooseService.connect((db) => {
		db.dropDatabase((err) => {
			if (err) {
				console.error(err);
			} else {
				console.log("Successfully dropped db: ", db.databaseName);
			}

			mongooseService.disconnect(done);
		});
	});
});

// Seed Mongo database based on configuration
gulp.task("mongo-seed", (done) => {
	// Open mongoose database connection
	mongooseService.connect(() => {
		mongooseService.loadModels();

		seed.start({
			options: {
				logResults: true
			}
		})
			.then(() => {
			// Disconnect and finish task
				mongooseService.disconnect(done);
			})
			.catch((err) => {
				mongooseService.disconnect((disconnectError) => {
					if (disconnectError) {
						console.log("Error disconnecting from the database, but was preceded by a Mongo Seed error.");
					}

					// Finish task with error
					done(err);
				});
			});
	});
});

// Lint CSS and JavaScript files.
gulp.task("lint", (done) => {
	runSequence(
		[
			"eslint",
		],
		done
	);
});

// Lint project files and minify them into two production files.
gulp.task("build", (done) => {
	runSequence(
		"env:dev",
		"wiredep:prod",
		"lint",
		[
			"uglify",
		],
		done
	);
});

// Run the project tests
gulp.task("test", (done) => {
	runSequence(
		"env:test",
		"test:server",
		"nodemon",
		done
	);
});

gulp.task("test:server", (done) => {
	runSequence(
		"env:test",
		[
			"copyLocalEnvConfig",
			"dropdb",
		],
		"lint",
		"mocha",
		done
	);
});

// Watch all server files for changes & run server tests (test:server) task on changes
gulp.task("test:server:watch", (done) => {
	runSequence(
		"test:server",
		"watch:server:run-tests",
		done
	);
});

gulp.task("test:e2e", (done) => {
	runSequence(
		"env:test",
		"lint",
		"dropdb",
		"nodemon",
		done
	);
});

gulp.task("test:coverage", (done) => {
	runSequence(
		"env:test",
		[
			"copyLocalEnvConfig",
			"dropdb",
		],
		"lint",
		"mocha:coverage",
		done
	);
});

// Run the project in development mode with node debugger enabled
gulp.task("default", (done) => {
	runSequence(
		"env:dev",
		[
			"copyLocalEnvConfig",
		],
		"lint",
		[
			"nodemon",
			"watch",
		],
		done
	);
});

// Run the project in production mode
gulp.task("prod", (done) => {
	runSequence(
		[
			"copyLocalEnvConfig",
			"makeUploadsDir",
			"templatecache",
		],
		"build",
		"env:prod",
		"lint",
		[
			"nodemon-nodebug",
			"watch",
		],
		done
	);
});

// Run Mongo Seed with default environment config
gulp.task("seed", (done) => {
	runSequence(
		"env:dev",
		"mongo-seed",
		done
	);
});

// Run Mongo Seed with production environment config
gulp.task("seed:prod", (done) => {
	runSequence(
		"env:prod",
		"mongo-seed",
		done
	);
});

gulp.task("seed:test", (done) => {
	runSequence(
		"env:test",
		"mongo-seed",
		done
	);
});
