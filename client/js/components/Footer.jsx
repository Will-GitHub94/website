import React from "react";

export default class Footer extends React.Component {
	constructor() {
		super();
		this.state = {
			componentName: "Footer",
		};
	}
	render() {
  	    return (
            <footer>
		        <small>Will Ashworth</small>
            </footer>
  	    );
	}
}
