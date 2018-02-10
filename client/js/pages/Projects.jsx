import React from "react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default class Projects extends React.Component {
	constructor() {
		super();
		this.state = {
			pageName: "Projects",
		};
	}

	render() {
		return (
  			<div>
  				<Header pageName={this.state.pageName} />
  				<body>
  					<p />
				</body>
  				<Footer />
			</div>
		);
	}
}
