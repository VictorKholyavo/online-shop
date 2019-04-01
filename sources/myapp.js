import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "models/session";

export default class MyApp extends JetApp {
	constructor(config){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/data",
			// views: {
			// 	login: "login",
			// 	data: "top/data"
			// }
		};

		super({ ...defaults, ...config });
		this.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				if (webix.storage.local.get("UserInfo")) {
					let token = webix.storage.local.get("UserInfo").token
					headers["authorization"] = "bearer " + token;
				}
			}
		);
		this.use(plugins.User, {
			model: session,
		});
		function getUser() {
			return webix.ajax().sync().get("http://localhost:3014/users/getInfo").response;
		}
		this.attachEvent("app:guard", function(url, view, nav) {
			try {
				let userInfo = JSON.parse(getUser());
				if (userInfo.admin) {
					if (url.indexOf("/top") !== -1) {
						nav.redirect = "/adminMenu/clientsInfo"
					}
				}
				else {
					if (url.indexOf("/adminMenu") !== -1) {
						nav.redirect = "/top/data"
					}
				}
			} catch (err) {
				console.log("You are not logged");
			}
		});
		webix.attachEvent("onBeforeAjax",
			function(mode, url, data, request, headers) {
				if (webix.storage.local.get("UserInfo")) {
					let token = webix.storage.local.get("UserInfo").token;
					headers["authorization"] = "bearer " + token;
				}
			}
		);
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => new MyApp().render() );
}
