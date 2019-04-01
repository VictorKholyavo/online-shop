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
					editable: true,
					editaction: "dblclick",
					columns: [
						{id: "username", header:["Name", {content:"textFilter", compare:likeCompare}], fillspace: true, editor: "text"},
						{id: "email", header:["Email", {content:"textFilter", compare:likeCompare}], width:180, editor: "text"},
						{id: "date", header: "Date", fillspace: true},
					],
					url: "http://localhost:3014/users",
					save: {
						url: "rest->http://localhost:3014/users",
						updateFromResponse: true
					},
					rowHeight: 80,
					select: true,
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
	}
}
