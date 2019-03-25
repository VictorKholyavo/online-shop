function status() {
  return webix.ajax().post("http://localhost:3014/users/login/status")
  .then(a => a.json());
}

function login(email, password) {
  return webix.ajax().post("http://localhost:3014/users/login", {
    email, password
  }).then(a => a.json());
}

function logout() {
  return webix.ajax().post("http://localhost:3014/users/logout")
  .then(a => a.json());
}

export default {
  status, login, logout
};
