/**
 * Module dependencies
 */
import adminPolicy from "../policies/admin.server.policy";
import admin from "../controllers/admin.server.controller";
import userRoutes from "./users.server.routes";

export default (app) => {
	userRoutes(app);

	// Users collection routes
	app.route("/api/users")
		.get(adminPolicy.isAllowed, admin.list);

	// Single user routes
	app.route("/api/users/:userId")
		.get(adminPolicy.isAllowed, admin.read)
		.put(adminPolicy.isAllowed, admin.update)
		.delete(adminPolicy.isAllowed, admin.remove);

	// Finish by binding the user middleware
	app.param("userId", admin.userByID);
};
