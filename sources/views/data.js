import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return {
			rows: [
				{
					view:"datatable",
					localId: "datatable",
					autoConfig:true,
					css:"webix_shadow_medium",
					columns: [
						{id: "name", header: "Name"},
						{id: "price", header: "Price"},
						{id: "rating", header: "Rating"},
					],
					url: "http://localhost:3014/products"
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
	}
}
