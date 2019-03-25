import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {

		var menu = {
			view: "tree",
			// id: "top:menu",
			// css: "app_menu",
			width: 300,
			activeTitle: true,
			scheme: {
				$group: "type"
			},
			// template: "#type#",
			url: "http://localhost:3014/manufacturers/all",
			select: true,
			on: {
				onItemClick: (id) => {
					console.log(id);
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
							type: "header",
							view: "template",
							localId: "header",
							css: "webix_dark mainHeader"
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
	do_status() {
		const user = this.app.getService("user");
		user.getStatus();
		console.log(user);
		// user.status()
	}
	init() {
		// this.use(plugins.Menu, "top:menu");
	}
	urlChange() {
		// this.do_status();
	}
}
