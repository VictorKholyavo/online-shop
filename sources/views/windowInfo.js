import {JetView} from "webix-jet";

export default class WindowInfoView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			width: 600,
			height: 400,
			position: "center",
			modal: true,
			head: {
				 view:"toolbar", margin:-4, cols:[
					 { view:"label", label: "", localId: "titleOfProduct" },
					 { view:"icon", icon:"wxi-close", click: () => {
						 this.$$('window').hide();
					 }}
				 ]
			 },
			body: {
				template: " ",
				localId: "info"
			},
			on: {
				onHide: () => {
					// this.$windowInfo().clear();
				}
			}
		};
	}
	showWindow(values) {
		this.$windowInfo().show();
		let image = "<img class='photo' src="+values.image+">";
		this.$$("info").define({template: "<div class='columnSettings'>"+ image +"</div><div class='columnSettings'><div class='rowSettings'><span class='infoProductHeader'>Name: </span>"+ values.name +"</div><div class='rowSettings'><span class='infoProductHeader'>Price: </span>"+ values.price +"</div><div class='rowSettings'><span class='infoProductHeader'>Rating: </span>"+ values.rating +"</div></div>"});
		this.$$("titleOfProduct").define({template: "<div class='headerInfo'>"+ values.name +"</div>"});
		this.$$("info").refresh();
		this.$$("titleOfProduct").refresh();
		// this.onSubmit = function(data) {
		// 	filled(data);
		// 	this.$$("window").hide();
		// };
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
