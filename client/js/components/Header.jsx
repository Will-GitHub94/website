import React from "react";

import Links from "./Links.jsx";

import "../../styles/Main.less";
import profilePic from "../../img/Mygestic_on_peaks.jpg";

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			componentName: "Header",
			author: "Will Ashworth",
			role: "Software Engineer",
		};
	}

	// On refresh, this is not updated as it is just passing a prop to title but is not updating itself...
	// The 'value' property on the input ensures 2-way data binding

	render() {
		return (
			<header>
				<img src={profilePic} alt="Professional Picture"/>
				<h1>{this.state.author}</h1>
				<h3>{this.state.role}</h3>
				<h5>{this.props.pageName}</h5>
				<Links/>
			</header>
		);
	}
}
