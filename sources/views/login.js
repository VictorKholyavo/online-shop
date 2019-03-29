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
							}
						},
						{
							view: "button",
							localId: "adminButton",
							value: "Register as admin",
							click: () => {
								let values = this.$$("form").getValues();
								webix.ajax().post("http://localhost:3014/admins/addadmin", values).then(function (response) {
									response = response.json();
									console.log(response);
								});
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

			});
		}
	}
	$getForm() {
		return this.$$("form");
	}
	init() {
		// webix.attachEvent("onBeforeAjax",
		// 	function(mode, url, data, request, headers) {
		// 		if (webix.storage.local.get("UserInfo")) {
		// 			headers["authorization"] = "bearer " + webix.storage.local.get("UserInfo").token;
		// 		}
		// 	}
		// );
	}
}
