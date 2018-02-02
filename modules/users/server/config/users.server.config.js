

/**
 * Module dependencies
 */
import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import config from "../../../../config/config";

const User = mongoose.model("User");

/**
 * Module init function
 */
const userConfig = (app) => {
	// Serialize sessions
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser((id, done) => {
		User.findOne({
			_id: id,
		}, "-salt -password", (err, user) => {
			done(err, user);
		});
	});

	// Initialize strategies
	config.utils.getGlobbedPaths(path.join(__dirname, "./strategies/**/*.js")).forEach((strategy) => {
		require(path.resolve(strategy))(config);
	});

	// Add passport"s middleware
	app.use(passport.initialize());
	app.use(passport.session());
};

export default userConfig;
