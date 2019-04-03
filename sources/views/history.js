import {JetView} from "webix-jet";
import WindowInfoStatusView from "./windowInfoStatus";

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
						// {id: "image", header: "Image", width: 100,
						// template: (obj) => {
						// 	let photo = "";
						// 	if (obj.image == "") {
						// 		photo = "<img class='defaultPhoto'>";
						// 	}
						// 	else {
						// 		photo = "<img src ="+obj.image+" class='smallPhoto'>";
						// 	}
						// 	return "<div class='columnSettings'>"+ photo +"</div>"
						// }
						// },
						{id: "productId", header:"Product", fillspace: true, template: (obj) => {
							return obj.productId.name
						}},
						{id: "amount", header: "Amount", width:180},
						{id: "address", header: "Address", fillspace: true},
						{id: "delivery", header: "Delivery", fillspace: true, template: (obj) => {
							return obj.delivery.name
						}},
						{id: "payment", header: "Payment", fillspace: true, template: (obj) => {
							return obj.payment.name
						}},
						{id: "date", header:"Date"},
						{id: "status", header:"Status", template: (obj) => {
							return obj.status.name
						}},
					],
					url: "http://localhost:3014/orders/:id",
					rowHeight: 80,
					select: true,
					on: {
						onItemClick: (id) => {
							let values = this.$$("datatable").getItem(id);
							console.log(values);
							let windowInfoStatus = this.windowInfoStatusView;
							if (id.column == "statusTitle") {
								webix.ajax().post("http://localhost:3014/statuses/status", {statusId: values.status}).then(function (response) {
									response = response.json();
									if (response.index == "declined") {
										windowInfoStatus.showWindow(values);
									}
								});
							}
						}
					}
				},
			]
		};
		// function likeCompare(value, filter){
		// 	value = value.toString().toLowerCase();
		// 	filter = filter.toString().toLowerCase();
		// 	return value.indexOf(filter) !== -1;
		// }
	}
	$getDatatable() {
		return this.$$("datatable");
	}
	init() {
		this.windowInfoStatusView = this.ui(WindowInfoStatusView);
	}
}
