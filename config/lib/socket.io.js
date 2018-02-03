

// Load the module dependencies
import path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import cookieParser from "cookie-parser";
import passport from "passport";
import socketio from "socket.io";
import session from "express-session";
import connectMongo from "connect-mongo";

import config from "../config";

const MongoStore = connectMongo(session);

// Define the Socket.io configuration method
export default (app, db) => {
	let server;
	if (config.secure && config.secure.ssl === true) {
		// Load SSL key and certificate
		const privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), "utf8");
		const certificate = fs.readFileSync(path.resolve(config.secure.certificate), "utf8");
		let caBundle;

		try {
			caBundle = fs.readFileSync(path.resolve(config.secure.caBundle), "utf8");
		} catch (err) {
			console.log("Warning: couldn\"t find or read caBundle file");
		}

		const options = {
			key: privateKey,
			cert: certificate,
			ca: caBundle,
			//  requestCert : true,
			//  rejectUnauthorized : true,
			secureProtocol: "TLSv1_method",
			ciphers: [
				"ECDHE-RSA-AES128-GCM-SHA256",
				"ECDHE-ECDSA-AES128-GCM-SHA256",
				"ECDHE-RSA-AES256-GCM-SHA384",
				"ECDHE-ECDSA-AES256-GCM-SHA384",
				"DHE-RSA-AES128-GCM-SHA256",
				"ECDHE-RSA-AES128-SHA256",
				"DHE-RSA-AES128-SHA256",
				"ECDHE-RSA-AES256-SHA384",
				"DHE-RSA-AES256-SHA384",
				"ECDHE-RSA-AES256-SHA256",
				"DHE-RSA-AES256-SHA256",
				"HIGH",
				"!aNULL",
				"!eNULL",
				"!EXPORT",
				"!DES",
				"!RC4",
				"!MD5",
				"!PSK",
				"!SRP",
				"!CAMELLIA",
			].join(":"),
			honorCipherOrder: true,
		};

		// Create new HTTPS Server
		server = https.createServer(options, app);
	} else {
		// Create a new HTTP server
		server = http.createServer(app);
	}
	// Create a new Socket.io server
	const io = socketio.listen(server);

	// Create a MongoDB storage object
	const mongoStore = new MongoStore({
		db,
		collection: config.sessionCollection,
		url: config.db.uri
	});

	// Intercept Socket.io"s handshake request
	io.use((socket, next) => {
		// Use the "cookie-parser" module to parse the request cookies
		cookieParser(config.sessionSecret)(socket.request, {}, (err) => {
			// Get the session id from the request cookies
			const sessionId = socket.request.signedCookies ?
				socket.request.signedCookies[config.sessionKey] : undefined;

			if (!sessionId) {
				return next(new Error("sessionId was not found in socket.request"), false);
			}

			// Use the mongoStorage instance to get the Express session information
			mongoStore.get(sessionId, (errGet, sessionGet) => {
				if (errGet) {
					return next(errGet, false);
				}
				if (!sessionGet) {
					return next(new Error(`session was not found for ${sessionId}`), false);
				}

				// Set the Socket.io session information
				socket.request.session = sessionGet;

				// Use Passport to populate the user details
				passport.initialize()(socket.request, {}, () => {
					passport.session()(socket.request, {}, () => {
						if (socket.request.user) {
							next(null, true);
						} else {
							next(new Error("User is not authenticated"), false);
						}
					});
				});
			});
		});
	});

	// Add an event listener to the "connection" event
	io.on("connection", (socket) => {
		config.files.server.sockets.forEach((socketConfiguration) => {
			require(path.resolve(socketConfiguration))(io, socket);
		});
	});

	return server;
};
