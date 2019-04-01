import {JetView} from "webix-jet";

export default class FormForOrderView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			scroll: false,
			elements: [
				{
					view: "text",
					name: "buyerName",
					label: "Your Name",
					invalidMessage: "Your Name can not be empty",
					labelWidth:140,
					required: true
				},
				{
					view: "text",
					name: "buyerEmail",
					label: "Email",
					invalidMessage: "Incorrect email",
					labelWidth:140,
					required: true
				},
				{
					view: "text",
					name: "phone",
					label: "Phone",
					invalidMessage: "Incorrect phone",
					labelWidth:140,
					required: true
				},
				{
					view: "richselect",
					name: "delivery",
					label: "Delivery type",
					invalidMessage: "Delivery Address can not be empty",
					labelWidth:140,
					options: "http://localhost:3014/delivery"
				},
				{
					view: "text",
					name: "address",
					label: "Delivery address",
					labelWidth:140,
					required: true
				},
				{
					view: "richselect",
					name: "payment",
					label: "Payment type",
					labelWidth:140,
					options: "http://localhost:3014/payment",
					required: true
				},
				{
					cols: [
						{
							view: "button",
							localId: "checkout",
							value: "Checkout",
							click: () => {
								const values = this.$getForm().getValues();
								this.onSubmit(values);
							}
						},
						{
							view: "button",
							localId: "closeButton",
							value: "Close",
							click: () => {
								this.hideOrNotHide();
							}
						}
					]
				}
			],
			rules: {
				$buyerName: webix.rules.isNotEmpty,
				$buyerEmail: webix.rules.isEmail,
				$phone: webix.rules.isNotEmpty,
				$address: webix.rules.isNotEmpty,
				$delivery: webix.rules.isNotEmpty,
				$payment: webix.rules.isNotEmpty,
				$all: webix.rules.isNotEmpty,
			}
		};
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
		this.getRoot().show();
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
