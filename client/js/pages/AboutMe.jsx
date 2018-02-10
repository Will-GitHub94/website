import React from "react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default class About extends React.Component {
	constructor() {
		super();
		this.state = {
			pageName: "About Me",
			profile: "So...last year I managed to complete my undergraduate BEng in Software Engineering and obtain a"
                    + " First Class degree with Honours. The course also included a successful year in industry. Since"
                    + " graduating, I have managed to secure a post as a Junior Developer at 1 of the most respected"
                    + " recruitment agencies in the UK. I am a keen learner. Away from development, I spend my leisure"
                    + " time in learning new areas of the technology industry, such as; Networking, Cryptography, and"
                    + " Ethical Hacking & Security. In an industry that is changing rapidly and where competition is"
                    + " intensifying, I believe it vitaI to have an enthusiasm to learn and to make yourself stand-out"
                    + "from the crowd. I currently hold 18 months industry experience, am a fast learner, and I love a"
                    + "challenge.",
		};
	}

	linkedInAuth() {

	}

	render() {
		return (
			<div>
				<Header pageName={this.state.pageName} />
				<body>
					<p>{this.state.profile}</p>
				</body>
				<Footer />
			</div>
		);
	}
}
