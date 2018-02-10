/**
 * Module dependencies
 */
import acl from "acl";

// Using the memory backend
const memoryBackend = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
const invokeRolesPolicies = () => {
	memoryBackend.allow([{
		roles: ["admin"],
		allows: [{
			resources: "/api/users",
			permissions: "*",
		}, {
			resources: "/api/users/:userId",
			permissions: "*",
		}],
	}]);
};

/**
 * Check If Admin Policy Allows
 */
const isAllowed = (req, res, next) => {
	const roles = (req.user) ? req.user.roles : ["guest"];

	// Check for user roles
	memoryBackend.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, allowed) => {
		if (err) {
			// An authorization error occurred
			return res.status(500).send("Unexpected authorization error");
		}
		if (allowed) {
			// Access granted! Invoke next middleware
			return next();
		}
		return res.status(403).json({
			message: "User is not authorized",
		});
	});
};

export default {
	invokeRolesPolicies,
	isAllowed
};
