import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter as Router } from "react-router-dom";

import routes from "./routes.jsx";

render(
	<AppContainer>
		<Router>
			{routes}
		</Router>
	</AppContainer>,
	document.getElementById("app")
);
