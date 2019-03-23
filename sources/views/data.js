import {JetView} from "webix-jet";
import {data} from "models/records";

export default class DataView extends JetView{
	config(){
		return {
			rows: [
				{
					view:"datatable",
					localId: "datatable",
					autoConfig:true,
					css:"webix_shadow_medium"
				},
				{
					view: "button",
					value: "get status of user",
					click: () => {
						this.do_status();
					}
				},
				{
					view: "button",
					value: "logout",
					click: () => {
						this.do_logout();
					}
				}
			]
		};
	}
	do_status() {
		const user = this.app.getService("user");
		user.getStatus();
		console.log(user);
		console.log(user.getStatus());
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init(){
		this.$$("datatable").parse(data);
	}
}
