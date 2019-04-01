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
							localId: "type",
							label: "Type of Product",
							options: "http://localhost:3014/types"
						},
						{
							view: "richselect",
							name: "manufacturer",
							localId: "manufacturer",
							label: "Manufacturer",
							options:{
								on: {
									onShow: function () {
										let typeValue = this.$scope.$$("type").data.value;
										this.getBody().filter(function(obj) {
											return obj.type == typeValue;
										});
									}
								},
								body: {
									url:"http://localhost:3014/manufacturers/all",
								}
							},
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
										this.saveProduct(values);
									}
								},
								{
									view: "button",
									localId: "closeButton",
									value: "Close",
									click:() => {
										this.show("/adminMenu/orders");
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
					type: "form",
					value: "Add Types and Manufactures of Products (start data)",
					click: () => {
						this.addStartData();
					}
				},
				{

				}
			]
		};
	}
	$getTypeRichselect() {
		return this.$$("type");
	}
	$getManufacturerRichselect() {
		return this.$$("manufacturer");
	}
	addStartData() {
		webix.ajax().post("http://localhost:3014/types/startData", []).then(
			webix.ajax().post("http://localhost:3014/manufacturers/startData", []).then(
				webix.ajax().post("http://localhost:3014/statuses/startData", []).then(
					webix.ajax().post("http://localhost:3014/payment/startData", []).then(
						webix.ajax().post("http://localhost:3014/delivery/startData", []).then()
					)
				)
			)
		);
	}
	saveProduct(values) {
		if (this.$getForm().validate()) {
			webix.ajax().post("http://localhost:3014/products", values);
			this.$getForm().clear();
			this.$getForm().clearValidation();
		}
		else {
			webix.message({ type:"error", text:"Invalid info" });
		}
	}
	showWindow(values) {
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
