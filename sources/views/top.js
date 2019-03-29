import { JetView, plugins } from "webix-jet";
import DataView from "./data";


export default class TopView extends JetView {
	config() {

		var menu = {
			view: "tree",
			localId: "tree",
			// id: "top:menu",
			// css: "app_menu",
			width: 300,
			activeTitle: true,
			url: "http://localhost:3014/types",
			select: true,
			on: {
				onItemClick: (id) => {
					this.show("/top/data")
					let level = this.$$("tree").getItem(id).$level;
					let data = [level, id];
					this.app.callEvent("filterDatatableByTypeAndManufacture", [data]);
				}
			}
		};

		const ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				{
					paddingX: 5,
					paddingY: 10,
					rows: [
						{
							type: "toolbar",
							localId: "toolbar",
							margin: 20,
							paddingX: 10,
							cols: [
								{ view: "template", template: "Online shop", width: 140 },
								{},
								{ view: "template", template: "Hi, ", width: 140 },
								{ view: "button", value: "Logout", width: 150, click: () => {this.do_logout(); window.location.reload(true); }},
								{ view: "button", value: "History", width: 150, click: () => {this.show("/top/history")}},
								{ view: "button", value: "Bag", localId: "bag", width: 150, click: () => {this.show("/top/bag")}}
							],
							css: "webix_dark"
						},
						{
							css: "webix_shadow_medium",
							cols: [
								menu,
								{ $subview:true }
							]
						}
					]
				},
				{
					type: "wide",
					paddingY: 10,
					paddingX: 5,
					rows: []
				}
			]
		};

		return ui;
	}
	$getBag() {
		return this.$$("bag")
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	refresh_bag_button() {
		let bag = this.$$("bag")
		webix.ajax().get("http://localhost:3014/bag/user").then(function (response) {
			response = response.json();
			bag.define({value: "Bag ("+response.length+")"});
			bag.refresh();
			return response.length
		});
	}
	init() {
		this.on(this.app, "addProductToBag", () => {
			this.refresh_bag_button();
		});
	}
	urlChange() {
		this.refresh_bag_button();
	}
}
