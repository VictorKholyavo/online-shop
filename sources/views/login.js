import { JetView } from "webix-jet";

export default class FormView extends JetView {
	config() {
		return {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					localId: "email",
					name: "email",
					label: "Email"
				},
				{
					view: "text",
					localId: "password",
					name: "password",
					label: "Password"
				},
				{
					cols: [
						{
							view: "button",
							localId: "userButton",
							value: "Login",
							hotkey: "Enter",
							click: () => {
								// this.do_login();
								let values = this.$$("form").getValues();
								let email = values.email;
								let password = values.password;
								webix.ajax().post("http://localhost:3014/users/login", {
									email, password
								}).then(function (response) {
									response = response.json();
									console.log(response);
								});
							}
						},
						{
							view: "button",
							value: "get admin page",
							click: () => {
								this.do_status();
								// webix.ajax().post("http://localhost:3014/users/status").then(function (response) {
								// 	response = response.json()
								// 	console.log(response)
								// });
							}
						},
						{
							view: "button",
							value: "logout",
							click: () => {
								this.do_logout();
								// webix.ajax().post("http://localhost:3014/users/status").then(function (response) {
								// 	response = response.json()
								// 	console.log(response)
								// });
							}
						}
					]
				}
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};
	}
	do_login() {
		const user = this.app.getService("user");
		const form = this.getRoot();

		if (form.validate()) {
			const data = form.getValues();
			user.login(data.email, data.password).catch(function () {
				//error handler
			});
		}
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	do_status() {
		const user = this.app.getService("user");
		user.getStatus();
		console.log(user);
		console.log(user.getStatus());
		// user.status()
	}
	$getForm() {
		return this.$$("form");
	}
	init() {
	}
}
