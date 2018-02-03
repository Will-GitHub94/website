/**
 * Module dependencies
 */
import mongoose from "mongoose";

const User = mongoose.model("User");

/**
 * User middleware
 */
const userByID = (req, res, next, id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: "User is invalid",
		});
	}

	User.findOne({
		_id: id,
	}).exec((errFindOne, user) => {
		if (errFindOne) {
			return next(errFindOne);
		} else if (!user) {
			return next(new Error(`Failed to load User ${id}`));
		}

		req.profile = user;
		next();
	});
};

export default {
	userByID
};
