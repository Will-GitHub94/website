import React from "react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default class NoMatch extends React.Component {
	constructor() {
		super();
		this.state = {
			pageName: "404",
			errorMessage: "Oops! Looks like you're trying to find a page that doesn't exist. Return to the previous"
				+ " page to keep viewing my awesome site",
		};
	}

	render() {
		return (
			<div>
				<Header pageName={this.state.pageName} />
				<body>
					<p>{this.state.errorMessage}</p>
				</body>
				<Footer />
			</div>
		);
	}
}
