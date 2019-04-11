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
					footer: true,
					scheme: {
						$init: (obj) => {
							obj.sum = obj.price * obj.amount;
						}
					},
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
								return "<div class='columnSettings'>"+ photo +"</div>";
							}
						},
						{id: "name", header:["Name", {content:"textFilter", compare:likeCompare}], fillspace: true},
						{id: "amount", header: "Amount", width:180},
						{id: "price", header: "Price", fillspace: true},
						{id: "sum", header: "Sum", fillspace: true, footer: {content:"summColumn"}},
						{id: "buy", header:"", width: 60, template:"{common.trashIcon()}"}
					],
					url: "http://localhost:3014/bag/user",
					save: {
						url: "rest->http://localhost:3014/bag/user",
						updateFromResponse: true
					},
					rowHeight: 80,
					select: true,
					onClick: {
						"wxi-trash": (e, id) => {
							this.$getDatatable().remove(id.row);
							return false;
						},
					},
				},
				{
					view: "button",
					value: "Make order",
					click: () => {
						let datatable = this.$getDatatable();
						let products = this.$getDatatable().data.pull;
						let ordersInDatatable = this.$getDatatable().data.order;
						let form = this.FormForOrderView;
						this.FormForOrderView.showWindow("", (data) => {
							for (var i = 0; i < ordersInDatatable.length; i++) {
								data.productId = products[ordersInDatatable[i]].productId;
								data.amount = products[ordersInDatatable[i]].amount;
								webix.ajax().post("http://localhost:3014/orders/add", data);
								webix.ajax().put("http://localhost:3014/bag/user/clearBag");
								datatable.clearAll();
								datatable.load(datatable.config.url);
							}
							form.hideOrNotHide();
							this.show("/top/history/");
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
