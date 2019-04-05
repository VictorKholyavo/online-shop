import {JetView} from "webix-jet";
import WindowInfoView from "./windowInfo";

export default class DataView extends JetView{
	config() {
		webix.protoUI({
			name:"datatableWithCounter"
		}, webix.ui.datatable, webix.ActiveContent);
		return {
			rows: [
				{
					view:"datatableWithCounter",
					localId: "datatable",
					autoConfig:true,
					css:"webix_shadow_medium",
					columns: [
						{id: "image", header: "Image", width: 100, template: (obj) => {
							let photo = "";
							if (obj.image == "") {
								photo = "<img class='defaultPhoto'>";
							}
							else {
								photo = "<img src ="+obj.image+" class='smallPhoto'>";
							}
							return "<div class='columnSettings'>"+ photo +"</div>";
						}},
						{id: "name", header:["Name", {content:"textFilter", compare:likeCompare}], fillspace: true},
						{id: "price", header: "Price", fillspace: true},
						{id: "rating", header: "Rating", fillspace: true},
						{id: "amount", header: "Amount", template: "{common.amountCounter()}", width:180},
						{id: "buy", header:"Buy", template:"<i class='fas fa-shopping-cart'></i>"}
					],
					url: "http://localhost:3014/products",
					rowHeight: 80,
					select: true,
					onClick: {
						"fa-shopping-cart": (e, id) => {
							let values = this.$$("datatable").getItem(id);
							if (values.amountCounter !== undefined) {
								let data = {productId: values.id, amount: values.amountCounter};
								webix.ajax().put("http://localhost:3014/bag/addProduct", data);
								this.app.callEvent("addProductToBag", []);
								webix.message({text: values.amountCounter + " " + values.name + " has been added to your bag"});
							}
						},
					},
					on: {
						onItemDblClick: (id) => {
							if (id.column !== "amount") {
								let values = this.$$("datatable").getItem(id);
								this.windowInfo.showWindow(values);
							}
						},
					},
					activeContent: {
						amountCounter: {
							view:"counter",
							localId: "count_dtable",
							width: 100,
							css: "amountCounter",
							step: 1,
							value: 0,
							min: 0,
							max: 50,
							height: 35,
						},
					},
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
	do_status() {
		const user = this.app.getService("user");
		user.getStatus();
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init(){
		this.windowInfo = this.ui(WindowInfoView);
		this.on(this.app, "filterDatatableByTypeAndManufacture", (data) => {
			if(data) {
				if (data[0] === 1) {
					this.$$("datatable").filter(
						function(obj) {
							return obj.type === data[1];
						}
					);
				}
				else if (data[0] === 2) {
					this.$$("datatable").filter(
						function(obj) {
							if (obj.manufacturer === data[1] && obj.type === data[2]) {
								return obj;
							}
						}
					);
				}
			}
		});
		this.on(this.app, "refreshDatatable", (newData) => {
			this.$getDatatable().updateItem(newData.id, newData);
		});
	}
}
