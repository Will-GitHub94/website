import React from "react";
import { Link } from "react-router-dom";

import "../../styles/Main.less"

export default class Links extends React.Component {
	constructor() {
		super();
		this.state = {
			componentName: "Links",
		}
	}

	// On refresh, this is not updated as it is just passing a prop to title but is not updating itself...
	// The 'value' property on the input ensures 2-way data binding

	render() {
		return (
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about-me">About Me</Link>
				</li>
				<li>
					<Link to="/projects">Projects</Link>
				</li>
				<li>
					<Link to="/knowledge">Knowledge</Link>
				</li>
			</ul>
		)
	}
}
