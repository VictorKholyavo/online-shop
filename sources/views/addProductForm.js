import {JetView} from "webix-jet";

export default class FormforProductView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "form",
					localId: "form",
					scroll: false,
					elements: [
						{
							view: "richselect",
							name: "type",
							label: "Type of Product",
							options: "http://localhost:3014/types"
						},
						{
							view: "richselect",
							name: "manufacturer",
							label: "Manufacturer",
							options: "http://localhost:3014/manufacturers/all"
						},
						{
							view: "text",
							name: "name",
							label: "Name"
						},
						{
							view: "text",
							name: "price",
							label: "Price"
						},
						{
							view: "template",
							localId: "image",
							name: "image",
							height: 300,
							template: (obj)=> {
								let photo = "";
								if (obj.src) {
									photo = "<img class='photo' src="+obj.src+">";
								}
								if (obj.src == "defaultPhoto") {
									photo = "<img class='defaultPhotoBig'>";
								}
								return photo;
							},
						},
						{
							view:"uploader",
							localId:"uploader_1",
							value: "Upload file",
							upload: "http://localhost:3014/upload",
							accept:"image/png, image/gif, image/jpg",
							multiple: false,
							on: {
								onBeforeFileAdd:function(item){
									var type = item.type.toLowerCase();
									if (type != "jpg" && type != "png"){
										webix.message("Only PNG or JPG images are supported");
										return false;
									}
								},
								onFileUpload: (response) => {
									webix.storage.local.put("image", response.path);
									this.$$("image").setValues({src: response.path});
								}
							}
						},
						{
							cols: [
								{
									view: "button",
									localId: "updateButton",
									value: "Save",
									click: () => {
										const values = this.$getForm().getValues();
										let image = webix.storage.local.get("image");
										values.image = image;
										console.log(values);
										this.saveProduct(values);
									}
								},
								{
									view: "button",
									localId: "closeButton",
									value: "Close",
									click: function () {
										this.getTopParentView().hide();
									}
								}
							]
						}
					],
					rules: {
						$all: webix.rules.isNotEmpty
					}
				},
				{
					view: "button",
					localId: "addType",
					value: "Add Type",
					click: () => {
						this.addStartData();
					}
				},
				{

				}
			]
		};
	}
	addStartData() {
		webix.ajax().post("http://localhost:3014/types/startData", []).then(function (response) {
			response = response.json();
			console.log(response._id);
		});
		webix.ajax().post("http://localhost:3014/manufacturers/startData", []).then(function (response) {
			response = response.json();
			console.log(response._id);
		});
		// let manufacturers = [
		// 	{value: "iPhone", type: "Phone"},
		// 	{value: "Samsung", type: "Phone"},
		// 	{value: "Huawei", type: "Phone"},
		// 	{value: "HP", type: "Notebooks"},
		// 	{value: "Acer", type: "Notebooks"},
		// 	{value: "Asus", type: "Notebooks"},
		// 	{value: "Sony", type: "TV"}
		// ]
		// for (let i = 0; i < manufacturers.length; i++) {
		// 	webix.ajax().post("http://localhost:3014/manufacturers", manufacturers[i]).then(function (response) {
		// 		response = response.json();
		// 		console.log(response);
		// 	});
		// }
	}
	saveProduct(values) {
		webix.ajax().post("http://localhost:3014/products", values).then(function (response) {
			response = response.json();
			console.log(response);
		});
	}
	showWindow(values, filled) {
		let formTemplate = this.$$("formTemplate");
		this.getRoot().show();
		if (values) {
			this.$getForm().setValues(values);
			formTemplate.define({template: "Edit Group"});
		}
		else {
			formTemplate.define({template: "Add Group"});
		}
		formTemplate.refresh();
	}
	init() {
	}
	$getForm() {
		return this.$$("form");
	}
}
