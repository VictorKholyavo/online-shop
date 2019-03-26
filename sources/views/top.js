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
								{ view: "button", value: "Logout", width: 150},
								{ view: "button", value: "History", width: 150},
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
	do_status() {
		const user = this.app.getService("user");
		user.getStatus();
		console.log(user);
		// user.status()
	}
	init() {
		// this.use(plugins.Menu, "top:menu");
		if (webix.storage.local.get("bag")) {
			let data = webix.storage.local.get("bag");
			this.$getBag().define({value: "Bag ("+data+")"});
			this.$getBag().refresh();
		}
		this.on(this.app, "addProductToBag", (data) => {
			console.log(data);
			this.$getBag().define({value: "Bag ("+data+")"});
			this.$getBag().refresh();
		});
	}
	urlChange() {
		// this.do_status();
	}
}
