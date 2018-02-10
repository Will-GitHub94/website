

describe("Users E2E Tests:", () => {
	const user1 = {
		firstName: "test",
		lastName: "user",
		email: "test.user@meanjs.com",
		username: "testUser",
		password: "P@$$w0rd!!",
	};

	const user2 = {
		firstName: "test",
		lastName: "user2",
		email: "test.user2@meanjs.com",
		username: "testUser2",
		password: "P@$$w0rd!!",
	};

	const signout = function () {
		// Make sure user is signed out first
		browser.get("http://localhost:3001/authentication/signout");
		// Delete all cookies
		browser.driver.manage().deleteAllCookies();
	};

	describe("Signup Validation", () => {
		it("Should report missing first name", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// First Name Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("First name is required.");
		});

		it("Should report missing last name", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Last Name Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Last name is required.");
		});

		it("Should report missing email address", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Email address is required.");
		});

		it("Should report invalid email address - "123"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys("123");
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Email address is invalid.");
		});

		/**
     * Note: 123@123 is a valid email adress according to HTML5.
     * However, 123@123@123 is an invalid email address.
     */
		it("Should report invalid email address - "123@123@123"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys("123@123@123");
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Email address is invalid.");
		});

		it("Should report invalid username - ".login"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(".login");
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.");
		});

		it("Should report invalid username - "login."", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys("login.");
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.");
		});

		it("Should report invalid username - "log..in"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys("log..in");
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.");
		});

		it("Should report invalid username - "lo"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys("lo");
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.");
		});

		it("Should report invalid username - "log$in"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys("log$in");
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Email address error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.");
		});

		it("Should signup username with . - "log.in"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user2.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user2.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys("someemail@meanjs.com");
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys("log.in");
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user2.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Signup successful with username having .
			expect(browser.getCurrentUrl()).toEqual("http://localhost:3001/");

			signout();
		});

		it("Should report missing username", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Username Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Username is required.");
		});

		it("Should report a password with less than 10 characters long - "P@$$w0rd!"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys("P@$$w0rd!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must be at least 10 characters long.");
		});

		it("Should report a password with greater than 128 characters long.", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys(")!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must be fewer than 128 characters.");
		});

		it("Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys("P@$$w0rd!!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password may not contain sequences of three or more repeated characters.");
		});

		it("Should report a password with no uppercase letters - "p@$$w0rd!!"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys("p@$$w0rd!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must contain at least one uppercase letter.");
		});

		it("Should report a password with less than one number - "P@$$word!!"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys("P@$$word!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must contain at least one number.");
		});

		it("Should report a password with less than one special character - "Passw0rdss"", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys("Passw0rdss");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must contain at least one special character.");
		});

		it("Should Successfully register new user", () => {
			browser.get("http://localhost:3001/authentication/signup");
			// Enter FirstName
			element(by.model("vm.credentials.firstName")).sendKeys(user1.firstName);
			// Enter LastName
			element(by.model("vm.credentials.lastName")).sendKeys(user1.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter UserName
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type="submit"]")).click();
			expect(browser.getCurrentUrl()).toEqual("http://localhost:3001/");
		});

		it("Should report Email already exists", () => {
			// Make sure user is signed out first
			signout();
			// Signup
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user2.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user2.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user1.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user2.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys(user2.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".message")).get(0).getText()).toBe("Email already exists");
		});

		it("Should report Username already exists", () => {
			// Signup
			browser.get("http://localhost:3001/authentication/signup");
			// Enter First Name
			element(by.model("vm.credentials.firstName")).sendKeys(user2.firstName);
			// Enter Last Name
			element(by.model("vm.credentials.lastName")).sendKeys(user2.lastName);
			// Enter Email
			element(by.model("vm.credentials.email")).sendKeys(user2.email);
			// Enter Username
			element(by.model("vm.credentials.username")).sendKeys(user1.username);
			// Enter Invalid Password
			element(by.model("vm.credentials.password")).sendKeys(user2.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".message")).get(0).getText()).toBe("Username already exists");
		});
	});

	describe("Signin Validation", () => {
		it("Should report missing credentials", () => {
			// Make sure user is signed out first
			signout();
			// Sign in
			browser.get("http://localhost:3001/authentication/signin");
			// Click Submit button
			element(by.css("button[type="submit"]")).click();
			// Username Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Username or Email is required.");
			// Password Error
			expect(element.all(by.css(".error-text")).get(1).getText()).toBe("Password is required.");
		});

		it("Verify that the user is logged in", () => {
			// Make sure user is signed out first
			signout();
			// Sign in
			browser.get("http://localhost:3001/authentication/signin");
			// Enter UserName
			element(by.model("vm.credentials.usernameOrEmail")).sendKeys(user1.username);
			// Enter Password
			element(by.model("vm.credentials.password")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type="submit"]")).click();
			expect(browser.getCurrentUrl()).toEqual("http://localhost:3001/");
		});
	});

	describe("Change Password Settings Validation", () => {
		it("Should report missing passwords", () => {
			browser.get("http://localhost:3001/settings/password");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Errors
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Your current password is required.");
			expect(element.all(by.css(".error-text")).get(1).getText()).toBe("Enter a new password.");
			expect(element.all(by.css(".error-text")).get(2).getText()).toBe("Verify your new password.");
		});

		it("Should report a password with less than 10 characters long - "P@$$w0rd!"", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter Invalid Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("P@$$w0rd!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must be at least 10 characters long.");
		});

		it("Should report a password with greater than 128 characters long.", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter Invalid Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys(")!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must be fewer than 128 characters.");
		});

		it("Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter Invalid Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("P@$$w0rd!!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password may not contain sequences of three or more repeated characters.");
		});

		it("Should report a password with no uppercase letters - "p@$$w0rd!!"", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter Invalid Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("p@$$w0rd!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must contain at least one uppercase letter.");
		});

		it("Should report a password with less than one number - "P@$$word!!"", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter Invalid Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("P@$$word!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must contain at least one number.");
		});

		it("Should report a password with less than one special character - "Passw0rdss"", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter Invalid Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("Passw0rdss");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Error
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("The password must contain at least one special character.");
		});

		it("Should report passwords do not match", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter New Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("P@$$w0rds!!");
			// Verify New Password
			element(by.model("vm.passwordDetails.verifyPassword")).sendKeys(user1.password);
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Errors
			expect(element.all(by.css(".error-text")).get(0).getText()).toBe("Passwords do not match.");
		});

		it("Should change the password to - "P@$$w0rds!!"", () => {
			browser.get("http://localhost:3001/settings/password");
			// Enter Current Password
			element(by.model("vm.passwordDetails.currentPassword")).sendKeys(user1.password);
			// Enter New Password
			element(by.model("vm.passwordDetails.newPassword")).sendKeys("P@$$w0rds!!");
			// Verify New Password
			element(by.model("vm.passwordDetails.verifyPassword")).sendKeys("P@$$w0rds!!");
			// Click Submit button
			element(by.css("button[type=submit]")).click();
			// Password Changed
			expect(element.all(by.css(".ui-notification")).get(0).getText()).toBe("Password Changed Successfully");
		});
	});
});
