import React from "react";
import { StaticRouter } from "react-router";
import App from "../../../client/App.jsx";


const getRouter = (url) => {
	const context = {};

	return (
		<StaticRouter location={url} context={context}>
			<App />
		</StaticRouter>
	);
};

export default {
	getRouter,
};
