import {JetView} from "webix-jet";

export default class ChangeStatusWindowView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			width: 600,
			scroll: false,
			elements: [
				{
					view: "richselect",
					name: "status",
					label: "Choose Status",
					// value: "#title#",
					options: {
						body: {
							// template: "#title#",
							url: "http://localhost:3014/statuses",
						}
					},
					on: {
						onChange: (newv, oldv) => {
							let textarea = this.$$("textarea")
							webix.ajax().post("http://localhost:3014/statuses/status", {statusId: newv}).then(function (response) {
								response = response.json();
								if (response.index == "declined") {
									textarea.show()
								}
								else {
									textarea.hide()
								}
							});
						}
					},
				},
				{
			    view: "textarea",
					localId: "textarea",
					hidden: true,
					name: "statusDescription",
			    label: "Reason",
			    labelAlign: "left",
					value: " ",
			    height: 200,
				},
				{
					cols: [
						{
							view: "button",
							localId: "updateButton",
							value: "Save",
							click: () => {
								const values = this.$getForm().getValues();
								this.onSubmit(values);
							}
						}
					]
				}
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		};

		return {
			view: "window",
			localId: "changeStatusWindow",
			width: 700,
			position: "center",
			modal: true,
			head: {
				view:"toolbar", margin:-4, cols:[
					{view:"label", label: "Change status", localId: "titleOfProduct"},
					{view:"icon", icon:"wxi-close", click: () => {
						this.$$("changeStatusWindow").hide();
						}
					}
				]
			},
			body: form,
			on: {
				onHide: () => {
					this.$getForm().clear();
					this.$getForm().clearValidation();
				}
			}
		};
	}
	showWindow(values, filled) {
		this.getRoot().show();
		this.$getForm().setValues(values);
		this.onSubmit = function(data) {
			if (this.$getForm().validate()) {
				webix.ajax().post("http://localhost:3014/statuses/status", {statusId: data.status}).then(function (response) {
					response = response.json();
					if (response.index == "inprocess") {
						data.statusDescription = "";
					}
					filled(data);
				})

			}
		};
	}
	init() {
	}
	$getForm() {
		return this.$$("form");
	}
	hideWindow() {
		webix.message("All is correct");
		this.$$("changeStatusWindow").hide();
	}
}
