import {JetView} from "webix-jet";

export default class WindowInfoStatusView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			width: 400,
			height: 250,
			position: "center",
			modal: true,
			head: {
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "Decline reasons"},
					{ view:"icon", icon:"wxi-close", click: () => {
						this.$$('window').hide();
						}
					}
				]
			},
			body: {
				template: " ",
				localId: "declineReasonInfo"
			}
		};
	}
	showWindow(values) {
		this.$windowInfo().show();
		this.$$("declineReasonInfo").define({template: ""+values.statusDescription+""});
		this.$$("declineReasonInfo").refresh();
	}
	init() {
	}
	$windowInfo() {
		return this.$$("window");
	}
	hideForm() {
		this.getRoot().hide();
	}
}
