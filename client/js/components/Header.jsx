import React from "react";

import Links from "./Links.jsx";
import profilePic from "../../img/brand/profilePic.jpg";

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			componentName: "Header",
			author: "Will Ashworth",
			role: "Software Engineer",
		};
	}

	render() {
		return (
			<header className="header">
				<img src={profilePic} alt="Professional Picture"/>
				<h1>{this.state.author}</h1>
				<h3>{this.state.role}</h3>
				<h5>{this.props.pageName}</h5>
				<Links/>
			</header>
		);
	}
}
