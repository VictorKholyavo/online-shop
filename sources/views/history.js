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
						{id: "productId", header:"productId", fillspace: true},
						{id: "amount", header: "Amount", width:180},
						{id: "address", header: "address", fillspace: true},
						{id: "delivery", header: "delivery", fillspace: true},
						{id: "payment", header: "payment", fillspace: true},
						{id: "date", header:"date"},
						{id: "status", header:"status"},
					],
					url: "http://localhost:3014/orders/:id",
					rowHeight: 80,
					select: true,
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
	init(){
		this.FormForOrderView = this.ui(FormForOrderView);
	}
}
