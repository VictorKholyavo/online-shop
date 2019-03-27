function status() {
  return webix.ajax().post("http://localhost:3014/users/login/status")
  .then(function (response) {
		response = response.json();
		// console.log(response);
		// webix.storage.local.put("tokenOfUser", response.token);
	});
}

function login(email, password) {
  return webix.ajax().post("http://localhost:3014/users/login", {
    email, password
  }).then(function (response) {
		response = response.json();
		// console.log(response);
		webix.storage.local.put("tokenOfUser", response.token);
	});
	// .then(a => a.json());
}

function logout() {
  return webix.ajax().post("http://localhost:3014/users/logout")
  .then(function (response) {
  	response = response.json()
  });
}

export default {
  status, login, logout
};
