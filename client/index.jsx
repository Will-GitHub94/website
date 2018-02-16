import React from "react";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
	<AppContainer>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</AppContainer>,
	document.getElementById("app")
);
