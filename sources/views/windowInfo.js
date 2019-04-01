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
			borderless: true,
			head: {
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "", localId: "titleOfProduct", template: "<i class='far fa-star'></i>" },
					{ view:"icon", icon:"wxi-close", click: () => {
						this.$$("window").hide();
					}
					}
				]
			},
			body: {
				borderless: true,

				cols: [
					{
						template: " ",
						width: 200,
						localId: "photo"
					},
					{
						template: " ",
						width: 160,
						localId: "info"
					},
					{
						width: 200,
						cols: [
							{
								rows: [
									{
										cols: [
											{ view: "template", localId: "rating",height: 100,  template: " "},
											{ view:"icon", align: "left", localId: "addRating",width: 80, icon:"fas fa-star"},
										]
									},
									{}
								]
							}
						]
					}
				]
			}
		};
	}
	showWindow(values) {
		this.$windowInfo().show();
		let rating = this.$$("rating");
		let refreshDatatable = this.app;
		let image = "<img class='photo' src="+values.image+">";
		this.$$("photo").define({template: "<div class='columnSettings'>"+ image +"</div>"});
		this.$$("info").define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoProductHeader'>Name: </span>"+ values.name +"</div><div class='rowSettings'><span class='infoProductHeader'>Price: </span>"+ values.price +"</div></div>"});
		this.$$("rating").define({template: "<div class='rowSettings'><span class='infoProductHeader'>Rating: </span>"+ values.rating +"</div>"});
		this.$$("titleOfProduct").define({template: "<div class='headerInfo'>"+ values.name +"</div>"});
		this.$$("info").refresh();
		this.$$("rating").refresh();
		this.$$("titleOfProduct").refresh();
		this.$$("photo").refresh();
		this.$$("addRating").attachEvent("onItemClick", function() {
			webix.ajax().post("http://localhost:3014/products/product", {productId: values.id}).then(function (response) {
				response = response.json();
				webix.ajax().put("http://localhost:3014/products/:id", {productId: response.id, rating: response.rating}).then(function (newData) {
					newData = newData.json();
					return newData;
				}).then(function (newData) {
					rating.define({template: "<div class='rowSettings'><span class='infoProductHeader'>Rating: </span>"+ newData.rating +"</div>"});
					rating.refresh();
					refreshDatatable.callEvent("refreshDatatable", [newData]);
				});
			});
		});
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
