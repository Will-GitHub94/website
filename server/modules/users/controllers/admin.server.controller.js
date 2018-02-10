

/**
 * Module dependencies
 */
import mongoose from "mongoose";
import errorHandler from "../../core/controllers/errors.server.controller";

const User = mongoose.model("User");
/**
 * Show the current user
 */
const read = (req, res) => {
	res.json(req.model);
};

/**
 * Update a User
 */
const update = (req, res) => {
	const user = req.model;

	// For security purposes only merge these parameters
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.displayName = `${user.firstName} ${user.lastName}`;
	user.roles = req.body.roles;

	user.save((err) => {
		if (err) {
			return res.status(422).send({
				message: errorHandler.getErrorMessage(err),
			});
		}

		res.json(user);
	});
};

/**
 * Delete a user
 */
const remove = (req, res) => {
	const user = req.model;

	user.remove((err) => {
		if (err) {
			return res.status(422).send({
				message: errorHandler.getErrorMessage(err),
			});
		}

		res.json(user);
	});
};

/**
 * List of Users
 */
const list = (req, res) => {
	User.find({}, "-salt -password -providerData").sort("-created").populate("user", "displayName")
		.exec((err, users) => {
			if (err) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(err),
				});
			}

			res.json(users);
		});
};

/**
 * User middleware
 */
const userByID = (req, res, next, id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: "User is invalid",
		});
	}

	User.findById(id, "-salt -password -providerData").exec((err, user) => {
		if (err) {
			return next(err);
		} else if (!user) {
			return next(new Error(`Failed to load user ${id}`));
		}

		req.model = user;
		next();
	});
};

export default {
	read,
	update,
	remove,
	list,
	userByID
};
