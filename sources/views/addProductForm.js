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
							name: "manufacturer",
							localId: "manufacturer",
							label: "Manufacturer",
							labelWidth: 120,
							on: {
								onChange: () => {
									this.$getTypeRichselect().setValue();
								}
							},
							options:{
								body: {
									template: "#title#",
									url:"http://localhost:3014/manufacturers/all",
								}
							},
						},
						{
							view: "richselect",
							name: "type",
							localId: "type",
							label: "Type of Product",
							labelWidth: 120,
							options: {
								on: {
									onShow: function () {
										let typeValue = this.$scope.$$("manufacturer").data.value;
										console.log(typeValue);
										this.getBody().filter(function(obj) {
											console.log(obj);
											for (var i = 0; i < obj.data.length; i++) {
												 if (obj.data[i].$id == typeValue) {
													return obj
												 }
											}
										});
									}
								},
								body: {
									template: "#title#",
									url: "http://localhost:3014/types"
								}
							}
						},
						{
							view: "text",
							name: "name",
							label: "Name",
							labelWidth: 120,
						},
						{
							view: "text",
							name: "price",
							label: "Price",
							labelWidth: 120,
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
					cols: [
						{
							view: "form",
							localId: "formForManufactures",
							scroll: false,
							elements: [
								{
									view: "text",
									name: "title",
									label: "Title",
									labelWidth: 120,
								},
								{
									view: "button",
									localId: "updateButton",
									value: "Save Manufacturer",
									click: () => {
										const values = this.$getFormForManufactures().getValues();
										const form = this.$getFormForManufactures();
										webix.ajax().post("http://localhost:3014/manufacturers", values).then(function () {
											form.clear();
											form.clearValidation();
										})
									}
								},
							],
							rules: {
								$all: webix.rules.isNotEmpty
							}
						},
						{
							view: "form",
							localId: "formForTypes",
							scroll: false,
							elements: [
								{
									view: "richselect",
									name: "manufacturer",
									localId: "manufacturerForType",
									label: "Manufacturer",
									labelWidth: 120,
									options: {
										body: {
											template: "#title#",
											url: "http://localhost:3014/manufacturers/all"
										}
									}
								},
								{
									view: "text",
									name: "title",
									label: "Title",
									labelWidth: 120,
								},
								{
									view: "button",
									localId: "updateButton",
									value: "Save Type of Product",
									click: () => {
										const values = this.$getFormForTypes().getValues();
										const form = this.$getFormForTypes();
										webix.ajax().post("http://localhost:3014/types", values).then(function () {
											form.clear();
											form.clearValidation();
										}, function (err) {
											webix.message({type: "error", text: err.responseText});
											form.clear();
											form.clearValidation();
										});
									}
								},
							],
							rules: {
								$all: webix.rules.isNotEmpty
							}
						}
					]
				},
				{
					view: "button",
					localId: "addType",
					type: "form",
					value: "Add Payments, Deliveries and Statuses (start data)",
					click: () => {
						this.addStartData();
					}
				},
				{}
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
		webix.ajax().post("http://localhost:3014/statuses/startData", []).then(
			webix.ajax().post("http://localhost:3014/payment/startData", []).then(
				webix.ajax().post("http://localhost:3014/delivery/startData", []).then()
			)
		)
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
	$getFormForManufactures() {
		return this.$$("formForManufactures");
	}
	$getFormForTypes() {
		return this.$$("formForTypes");
	}
}
