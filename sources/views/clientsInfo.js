import {JetView} from "webix-jet";

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
						{id: "name", header:"Name", fillspace: true},
						{id: "email", header: "Email", width:180},
						{id: "date", header: "Date", fillspace: true},
					],
					url: "http://localhost:3014/users",
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
	}
}
