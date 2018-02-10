/**
 * Module dependencies
 */
import { extend, pick } from "lodash";
import fs from "fs";
import path from "path";
import validator from "validator";
import mongoose from "mongoose";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import amazonS3URI from "amazon-s3-uri";

import errorHandler from "../../../../core/server/controllers/errors.server.controller";
import config from "../../../../../config/config";

const User = mongoose.model("User");
const whitelistedFields = [
	"firstName",
	"lastName",
	"email",
	"username",
];
const useS3Storage = config.uploads.storage === "s3" && config.aws.s3;
let s3;

if (useS3Storage) {
	aws.config.update({
		accessKeyId: config.aws.s3.accessKeyId,
		secretAccessKey: config.aws.s3.secretAccessKey,
	});

	s3 = new aws.S3();
}

/**
 * Update user details
 */
const update = (req, res) => {
	// Init Variables
	let { user } = req;

	if (user) {
		// Update whitelisted fields only
		user = extend(user, pick(req.body, whitelistedFields));

		user.updated = Date.now();
		user.displayName = `${user.firstName} ${user.lastName}`;

		user.save((errSave) => {
			if (errSave) {
				return res.status(422).send({
					message: errorHandler.getErrorMessage(errSave),
				});
			}
			req.login(user, (errLogin) => {
				if (errLogin) {
					res.status(400).send(errLogin);
				} else {
					res.json(user);
				}
			});
		});
	} else {
		res.status(401).send({
			message: "User is not signed in",
		});
	}
};

/**
 * Update profile picture
 */
const changeProfilePicture = (req, res) => {
	const { user } = req;
	let existingImageUrl;
	let multerConfig;

	if (useS3Storage) {
		multerConfig = {
			storage: multerS3({
				s3,
				bucket: config.aws.s3.bucket,
				acl: "public-read",
			}),
		};
	} else {
		multerConfig = config.uploads.profile.image;
	}

	// Filtering to upload only images
	multerConfig.fileFilter = require(path.resolve("./config/lib/multer")).imageFileFilter;

	const upload = multer(multerConfig).single("newProfilePicture");

	const uploadImage = () => {
		return new Promise(((resolve, reject) => {
			upload(req, res, (uploadError) => {
				if (uploadError) {
					reject(errorHandler.getErrorMessage(uploadError));
				} else {
					resolve();
				}
			});
		}));
	};

	const updateUser = () => {
		return new Promise(((resolve, reject) => {
			user.profileImageURL = config.uploads.storage === "s3" && config.aws.s3 ?
				req.file.location :
				`/${req.file.path}`;
			user.save((err, theuser) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}));
	};

	const deleteOldImage = () => {
		return new Promise(((resolve, reject) => {
			if (existingImageUrl !== User.schema.path("profileImageURL").defaultValue) {
				if (useS3Storage) {
					try {
						const { region, bucket, key } = amazonS3URI(existingImageUrl);
						const params = {
							Bucket: config.aws.s3.bucket,
							Key: key,
						};

						s3.deleteObject(params, (err) => {
							if (err) {
								console.log("Error occurred while deleting old profile picture.");
								console.log(`Check if you have sufficient permissions : ${err}`);
							}

							resolve();
						});
					} catch (err) {
						console.warn(`${existingImageUrl} is not a valid S3 uri`);

						return resolve();
					}
				} else {
					fs.unlink(path.resolve(`.${existingImageUrl}`), (unlinkError) => {
						if (unlinkError) {
							// If file didn"t exist, no need to reject promise
							if (unlinkError.code === "ENOENT") {
								console.log("Removing profile image failed because file did not exist.");
								return resolve();
							}
							console.error(unlinkError);
							unlinkError.message = "Error occurred while deleting old profile picture";

							reject(unlinkError);
						} else {
							resolve();
						}
					});
				}
			} else {
				resolve();
			}
		}));
	};

	const login = () => {
		return new Promise(((resolve, reject) => {
			req.login(user, (err) => {
				if (err) {
					res.status(400).send(err);
				} else {
					resolve();
				}
			});
		}));
	};

	if (user) {
		existingImageUrl = user.profileImageURL;
		uploadImage()
			.then(updateUser)
			.then(deleteOldImage)
			.then(login)
			.then(() => {
				res.json(user);
			})
			.catch((err) => {
				res.status(422).send(err);
			});
	} else {
		res.status(401).send({
			message: "User is not signed in",
		});
	}
};

/**
 * Send User
 */
const me = (req, res) => {
	// Sanitize the user - short term solution. Copied from core.server.controller.js
	// TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
	let safeUserObject = null;

	if (req.user) {
		safeUserObject = {
			displayName: validator.escape(req.user.displayName),
			provider: validator.escape(req.user.provider),
			username: validator.escape(req.user.username),
			created: req.user.created.toString(),
			roles: req.user.roles,
			profileImageURL: req.user.profileImageURL,
			email: validator.escape(req.user.email),
			lastName: validator.escape(req.user.lastName),
			firstName: validator.escape(req.user.firstName),
			additionalProvidersData: req.user.additionalProvidersData,
		};
	}

	res.json(safeUserObject || null);
};

export default {
	update,
	changeProfilePicture,
	me
};
