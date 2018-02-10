/**
 * Module dependencies
 */
import passport from "passport";
import passportLocal from "passport-local";
import mongoose from "mongoose";

const LocalStrategy = passportLocal.Strategy;
const User = mongoose.model("User");

export default () => {
	// Use local strategy
	passport.use(new LocalStrategy(
		{
			usernameField: "usernameOrEmail",
			passwordField: "password",
		},
		(usernameOrEmail, password, done) => {
			User.findOne({
				$or: [{
					username: usernameOrEmail.toLowerCase(),
				}, {
					email: usernameOrEmail.toLowerCase(),
				}],
			}, (err, user) => {
				if (err) {
					return done(err);
				}
				if (!user || !user.authenticate(password)) {
					return done(null, false, {
						message: `Invalid username or password (${  (new Date()).toLocaleTimeString()  })`
					});
				}

				return done(null, user);
			});
		},
	));
};
