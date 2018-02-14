export default {
	app: {
		title: "Website",
		description: "My professional website using the MERN stack",
		keywords: [
			"mongodb",
			"express",
			"node.js",
			"react.js",
			"mongoose",
			"passport"
		],
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || "GOOGLE_ANALYTICS_TRACKING_ID",
	},
	db: {
		promise: global.Promise,
	},
	port: process.env.PORT || 8000,
	host: process.env.HOST || "0.0.0.0",
	domain: process.env.DOMAIN,
	// Session Cookie settings
	sessionCookie: {
		// session expiration is set by default to 24 hours
		maxAge: 24 * (60 * 60 * 1000),
		// httpOnly flag makes sure the cookie is only accessed
		// through the HTTP protocol and not JS/browser
		httpOnly: true,
		// secure cookie should be turned to true to provide additional
		// layer of security so that the cookie is set only when working
		// in HTTPS mode.
		secure: false,
	},
	sessionSecret: process.env.SESSION_SECRET || "VANILLA",
	sessionKey: process.env.SESSION_KEY || "sessionId",
	sessionCollection: "sessions",
	csrf: {
		csrf: false,
		csp: false,
		xframe: "SAMEORIGIN",
		p3p: "ABCDEF",
		xssProtection: true,
	},
	logo: "client/img/brand/logo.png",
	favicon: "client/img/brand/favicon.ico",
	illegalUsernames: [
		"administrator",
		"password",
		"admin",
		"user",
		"unknown",
		"anonymous",
		"null",
		"undefined",
		"api",
	],
	aws: {
		s3: {
			accessKeyId: process.env.S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			bucket: process.env.S3_BUCKET,
		},
	},
	uploads: {
		storage: process.env.UPLOADS_STORAGE || "local",
	},
	shared: {
		owasp: {
			allowPassphrases: true,
			maxLength: 128,
			minLength: 10,
			minPhraseLength: 20,
			minOptionalTestsToPass: 4,
		},
	},
};
