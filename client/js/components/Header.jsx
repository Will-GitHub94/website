import React from "react";
import { Link } from "react-router-dom";

import "../../styles/Main.less"

export default class Header extends React.Component {
	constructor() {
		 super();
		 this.state = {
			componentName: "Header",
			author: "Will Ashworth",
            role: "Software Engineer",
		 }
    }

    // On refresh, this is not updated as it is just passing a prop to title but is not updating itself...
    // The 'value' property on the input ensures 2-way data binding

	render() {
	  	return (
  			<header>
                <img src={"../../img/Mygestic_on_peaks.jpg"} alt="Professional Picture"/>
                <h1>{this.state.author}</h1>
                <h3>{this.state.role}</h3>
                <h5>{this.props.pageName}</h5>

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
  			</header>
	  	)
   	}
}
