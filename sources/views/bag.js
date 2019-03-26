import {JetView} from "webix-jet";
import FormForOrderView from "./formOrder";

export default class DataView extends JetView{
	config() {
		return {
			rows: [
				{
					view:"datatable",
					localId: "datatable",
					autoConfig:true,
					css:"webix_shadow_medium",
					columns: [
						{id: "image", header: "Image", width: 100,
						template: (obj) => {
							let photo = "";
							if (obj.image == "") {
								photo = "<img class='defaultPhoto'>";
							}
							else {
								photo = "<img src ="+obj.image+" class='smallPhoto'>";
							}
							return "<div class='columnSettings'>"+ photo +"</div>"
						}
						},
						{id: "name", header:["Name", {content:"textFilter", compare:likeCompare}], fillspace: true},
						{id: "amount", header: "Amount", width:180},
						{id: "price", header: "Price", fillspace: true},
						{id: "sum", header: "Sum", fillspace: true},
						{id: "rating", header: "Rating", fillspace: true},
						{id: "buy", header:"Buy", template:"{common.trashIcon()}"}
					],
					url: "http://localhost:3014/bag/user",
					rowHeight: 80,
					select: true,
					onClick: {
						"wxi-trash": (e, id) => {
							// let values = this.$$("datatable").getItem(id);
							// if (values.amountCounter !== undefined) {
							// 	if (!webix.storage.local.get("bag")) {
							// 		webix.storage.local.put("bag", 1);
							// 	}
							// 	else {
							// 		webix.storage.local.put("bag", webix.storage.local.get("bag") + 1);
							// 	}
							// 	let bag = webix.storage.local.get("bag")
							// 	this.app.callEvent("addProductToBag", [bag]);
							// 	webix.message({text: values.amountCounter + " " + values.name + " has been added to your bag"});
							// }
						},
					},
				},
				{
					view: "button",
					value: "Make order",
					click: () => {
						// webix.storage.local.remove("bag");
						let products = this.$getDatatable().data.pull;
						console.log(products);
						let form = this.FormForOrderView
						this.FormForOrderView.showWindow("", function(data) {
							console.log(data);
							form.hideOrNotHide();
						});
					}
				}
			]
		};
		function likeCompare(value, filter){
			value = value.toString().toLowerCase();
			filter = filter.toString().toLowerCase();
			return value.indexOf(filter) !== -1;
		}
	}
	$getDatatable() {
		return this.$$("datatable");
	}
	init(){
		this.FormForOrderView = this.ui(FormForOrderView);
	}
}
