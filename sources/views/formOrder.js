import {JetView} from "webix-jet";

export default class FormForOrderView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				// {
				// 	view: "richselect",
				// 	name: "type",
				// 	label: "Type of Product",
				// 	options: "http://localhost:3014/types"
				// },
				// {
				// 	view: "richselect",
				// 	name: "manufacturer",
				// 	label: "Manufacturer",
				// 	options: "http://localhost:3014/manufacturers/all"
				// },
				{
					view: "text",
					name: "buyerName",
					label: "Your Name"
				},
				{
					view: "text",
					name: "buyerEmail",
					label: "Email"
				},
				{
					view: "text",
					name: "phone",
					label: "Phone"
				},
				{
					view: "richselect",
					name: "delivery",
					label: "Delivery type",
					options: ["Master", "Pickup"]
				},
				{
					view: "text",
					name: "address",
					label: "Delivery address"
				},
				{
					view: "richselect",
					name: "payment",
					label: "Payment type",
					options: ["Cash", "Card"]
				},
				{
					view: "button",
					localId: "checkout",
					value: "Checkout",
					click: () => {
						const values = this.$getForm().getValues();
						this.onSubmit(values);
					}
				}
			],
			rules: {
				$all: webix.rules.isNotEmpty
			}
		}
		return {
			view: "window",
			localId: "formForOrder",
			position: "center",
			width: 1000,
			modal: true,
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
		// let formTemplate = this.$$("formTemplate");
		this.getRoot().show();
		// if (values) {
		// 	this.$getForm().setValues(values);
		// 	formTemplate.define({template: _("Edit word")});
		// }
		// else {
		// 	formTemplate.define({template: _("Add word")});
		// }
		// formTemplate.refresh();
		this.onSubmit = function(data) {
			if (this.$getForm().validate()) {
				filled(data);
			}
		};
	}
	init() {
	}
	$getForm() {
		return this.$$("form");
	}
	hideOrNotHide() {
		this.$$("formForOrder").hide();
	}
}
