import React from "react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			pageName: "Home",
			intro: "Hey! My name is Will Ashworth (although that was probably obvious from the header).\nBasic overview is"
                    + " that I am a Software Engineer. Yep, broad term isn't it? Well I prefer to say Software Engineer"
                    + " over Developer as coding is not all I do...also, my degree was Software Engineering.\nThis site"
                    + " is just my portfolio in a broad overview. You can see a little bit about me (which is basically"
                    + " my CV lets be honest), projects I have worked on, and a cool little setion called 'Knowledge'...\n"
                    + "The Knowledge section is a group of markdown files held in 1 of my Git repos. As people often complain"
                    + " about, when something new goes into your brain, it usually has the unfortunate side effect of pushing"
                    + " something else out (damn you 10%!!). So...in light of this I created a repo that I will probably go back"
                    + " to in later life to just brush up on things I have forgotten over my career. If you wanna take a look"
                    + " and think I have missed something out, consider becoming a contributor :)",
		};
	}

	render() {
		return (
            <div>
                <Header pageName={this.state.pageName} />
                <body>
                    <p className="something">{this.state.intro}</p>
				</body>
                <Footer />
			</div>
		);
	}
}
