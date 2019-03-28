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
					console.log(headers);
				}
			}
		);
		this.use(plugins.User, {
			model: session,
			login: "/login",
			afterLogin: "/top/data",
			// public: path => path.indexOf("/top/data") > -1
		});

		// this.attachEvent("app:guard", function(url, view, nav){
		// 	if (url.indexOf("/top") !== -1)
		// 		nav.redirect="/login";
		// })
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => new MyApp().render() );
}
