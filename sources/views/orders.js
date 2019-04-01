import {JetView} from "webix-jet";
import ChangeStatusWindowView from "./changeStatusWindow";

export default class DataView extends JetView{
	config() {
		return {
			rows: [
				{
					view:"datatable",
					localId: "datatable",
					autoConfig:true,
					css:"webix_shadow_medium",
					editable: true,
					columns: [
						{id: "productTitle", header:"Product", fillspace: true},
						{id: "amount", header: "Amount", width: 80},
						{id: "buyerName", header: "buyerName", fillspace: true},
						{id: "buyerEmail", header: "buyerEmail", fillspace: true},
						{id: "phone", header: "phone", width: 100},
						{id: "address", header: "address", width: 150},
						{id: "deliveryTitle", header: "delivery", width: 100},
						{id: "paymentTitle", header: "payment", width: 100},
						{id: "date", header:"date", fillspace: true},
						{id: "statusTitle", header:"Status"}
					],
					url: "http://localhost:3014/orders",
					save: {
						url: "rest->http://localhost:3014/orders",
						updateFromResponse: true
					},
					on: {
						onItemClick: (id) => {
							let datatable = this.$$("datatable");
							let values = this.$$("datatable").getItem(id);
							if (id.column == "statusTitle") {
								let form = this.ChangeStatusWindowView;
								this.ChangeStatusWindowView.showWindow({status: values.status, statusDescription: values.statusDescription}, function(data) {
									datatable.updateItem(id.row, data);
									form.hideWindow();
									return false;
								});
							}
						}
					},
					rowHeight: 80,
					select: true,
				},

			]
		};
	}
	$getDatatable() {
		return this.$$("datatable");
	}
	init(){
		this.ChangeStatusWindowView = this.ui(ChangeStatusWindowView);
	}
}
