import {JetView} from "webix-jet";

export default class FormforProductView extends JetView {
	config() {
		return {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "name",
					label: "Name"
				},
				{
					cols: [
						{
							view: "button",
							localId: "updateButton",
							value: "Save",
							click: () => {
								const values = this.$getForm().getValues();
								console.log(values);
							}
						},
						{
							view: "button",
							localId: "closeButton",
							value: "Close",
							click: function () {
								this.getTopParentView().hide();
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
	showWindow(values, filled) {
		let formTemplate = this.$$("formTemplate");
		this.getRoot().show();
		if (values) {
			this.$getForm().setValues(values);
			formTemplate.define({template: "Edit Group"});
		}
		else {
			formTemplate.define({template: "Add Group"});
		}
		formTemplate.refresh();
	}
	init() {
	}
	$getForm() {
		return this.$$("form");
	}
}
