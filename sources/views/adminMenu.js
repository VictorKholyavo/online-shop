import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView{
	config() {

		const menu = {
			view: "menu",
			id:"top:menu",
			localId: "menu",
			css: "app_menu",
			width: 220, layout:"y", select:true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ value: "Cleints Info", id:"clientsInfo", icon:"wxi-columns" },
				{ value: "Orders",	id:"orders",  icon:"wxi-pencil" },
				{ value: "Add Product",	id:"addProductForm",  icon:"wxi-pencil" }
			]
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
								{ view: "template", localId: "helloTemplate", template: " ", width: 240 },

								{ view: "button", value: "Logout", width: 150, click: () => {this.do_logout(); window.location.reload(true); }}
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
	$getHelloTemplate() {
		return this.$$("helloTemplate");
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init(){
		this.use(plugins.Menu, "top:menu");
		let username = webix.storage.local.get("UserInfo").username;
		this.$getHelloTemplate().define({template: "Hi, " + username});
		this.$getHelloTemplate().refresh();
	}
}
