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
							value: "registration",
							click: () => {
								let values = this.$$("form").getValues();
								console.log(values);
								webix.ajax().post("http://localhost:3014/users/registration", values).then(function (response) {
									response = response.json();
								});
							}
						},
						{
							view: "button",
							localId: "userButton",
							value: "Login",
							hotkey: "Enter",
							click: () => {
								this.do_login();
								// let values = this.$$("form").getValues();
								// let email = values.email;
								// let password = values.password;
								// webix.ajax().post("http://localhost:3014/users/login", values).then(function (response) {
								// 	response = response.json();
								// 	console.log(response);
								// 	webix.storage.local.put("tokenOfUser", response.token);
								// });
							}
						},
						{
							view: "button",
							value: "get admin page",
							click: () => {
								this.do_status();
								// webix.ajax().post("http://localhost:3014/users/login/status").then(function (response) {
								// 	response = response.json()
								// 	console.log(response)
								// });
							}
						},
						{
							view: "button",
							value: "logout",
							click: () => {
								webix.storage.local.remove("tokenOfUser");
								this.do_logout();
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
		// user.status()
	}
	$getForm() {
		return this.$$("form");
	}
	init() {
		webix.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				if (webix.storage.local.get("tokenOfUser")) {
					headers["Authorization"] = "bearer " + webix.storage.local.get("tokenOfUser");
				}
			}
		);
	}
}
