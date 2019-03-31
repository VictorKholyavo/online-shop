import { JetView } from "webix-jet";

export default class FormView extends JetView {
	config() {
		const login_form = {
			view: "form",
			localId: "login_form",
			width: 600,
			borderless: false,
			margin: 20,
			scroll: false,
			elements: [
				{
					view: "text",
					localId: "email",
					name: "email",
					type: "email",
					attributes: {
						required: true,
						title: "Email is required"
					},
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
		}
		return {
			cols: [{}, {rows: [{}, login_form, {}]}, {}]
		};
	}
	do_login() {
		const user = this.app.getService("user");
		const form = this.getRoot();

		 if (this.$getForm().validate()) {
			const data = this.$getForm().getValues();
			user.login(data.email, data.password).catch(function () {

			});
		 }
	}
	$getForm() {
		return this.$$("login_form");
	}
	init() {
	}
}
