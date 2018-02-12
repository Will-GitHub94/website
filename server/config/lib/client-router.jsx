import React from "react";
import { StaticRouter } from "react-router";
import App from "../../../client/App.jsx";

/*
  This file is only here as eslint complains of JSX being in a JS file and I am unsure as to why
  Once this is resolved, this code can go back in 'express.js'
 */

export default (url, context) => (
	<StaticRouter location={url} context={context}>
		<App />
	</StaticRouter>
);
