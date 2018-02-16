import React from "react";
import { Switch, Route } from "react-router";

import Projects from "./js/pages/Projects.jsx";
import Home from "./js/pages/Home.jsx";
import AboutMe from "./js/pages/AboutMe.jsx";
import Knowledge from "./js/pages/Knowledge.jsx";
import NoMatch from "./js/pages/NoMatch.jsx";

export default () => (
	<Switch>
		<Route exact path="/" component={Home}/>
		<Route path="/about-me" component={AboutMe}/>
		<Route path="/knowledge" component={Knowledge}/>
		<Route path="/projects" component={Projects}/>
		<Route component={NoMatch}/>
	</Switch>
);
