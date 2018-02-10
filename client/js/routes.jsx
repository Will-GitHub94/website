import React from "react";
import { Route } from "react-router-dom";

import Projects from "./pages/Projects.jsx";
import Home from "./pages/Home.jsx";
import AboutMe from "./pages/AboutMe.jsx";
import Knowledge from "./pages/Knowledge.jsx";

export default (
	<Route exact path="/" component={Home}>
		<Route path="about-me" component={AboutMe}/>
		<Route path="projects" component={Projects}/>
		<Route path="knowledge" component={Knowledge}/>
	</Route>
);
