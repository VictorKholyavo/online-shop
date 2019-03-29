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
			],
			on: {
				onAfterSelect:function(id){
					// const header = this.$scope.$$("header");
					// header.define({template: this.getItem(id).value});
					// header.refresh();
				},
			},
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
								{ view: "button", value: "History", width: 150, click: () => {let buyerInfo = webix.ajax().sync().get("http://localhost:3014/users/getInfo"); buyerInfo = JSON.parse(buyerInfo.response); console.log(buyerInfo);}},
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
	do_status() {
		const user = this.app.getService("user");
		user.getStatus();
		console.log(user);
		// user.status()
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init(){
		this.use(plugins.Menu, "top:menu");
	}
}
