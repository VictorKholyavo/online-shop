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
							let values = this.$$("datatable").getItem(id);
							console.log(values.id);
							webix.ajax().put("http://localhost:3014/bag/removeProduct", {orderId: values.id}).then(function (response) {
								response = response.json();
								console.log(response);
							});
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

						let products = this.$getDatatable().data.pull;
						let ordersInDatatable = this.$getDatatable().data.order;
						let form = this.FormForOrderView;
						let sendData = [];
						console.log(webix.storage.local.get("UserInfo"));
						this.FormForOrderView.showWindow("", (data) => {
							for (var i = 0; i < ordersInDatatable.length; i++) {
								data.buyerId = webix.storage.local.get("UserInfo").userId;
								data.productId = products[ordersInDatatable[i]].productId;
								data.amount = products[ordersInDatatable[i]].amount;
								webix.ajax().post("http://localhost:3014/orders/add", data).then(function (response) {
									response = response.json();
									console.log(response);
								});
								// webix.storage.local.remove("bag");
							}
							// webix.ajax().get("http://localhost:3014/bag/user").then(function (response) {
							// 	response = response.json();
							// 	return response
							// }).then(function (bag) {
							// 	for (let i = 0; i < bag.length; i++) {
							// 		data.productId = bag[i].productId;
							// 		console.log(bag[i].productId);
							// 		sendData.push(data)
							// 		console.log(sendData);
							//
							// 		// console.log(bag[i].productId);
							// 	}
							// });
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
