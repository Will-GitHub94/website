

/**
 * Module dependencies
 */
import { extend } from "lodash";

import authenticateControl from "./users/users.authentication.server.controller";
import authorizeControl from "./users/users.authorization.server.controller";
import passControl from "./users/users.password.server.controller";
import profileControl from "./users/users.profile.server.controller";

/**
 * Extend user"s controller
 */
export default extend(
	authenticateControl,
	authorizeControl,
	passControl,
	profileControl
);
