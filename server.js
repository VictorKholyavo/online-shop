const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const User = require('./server/schemas/users');
const UsersController = require('./server/controllers/users');
const ProductsController = require('./server/controllers/products');
const TypesController = require('./server/controllers/types');
const ManufacturersController = require('./server/controllers/manufacturers');
const ImageController = require('./server/controllers/images');
const BagController = require('./server/controllers/bag');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
// const FileStore = require("session-file-store")(session);
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

app.use(cors({
	origin:['http://localhost:8080'],
	methods:['GET','POST'],
	credentials: true // enable set cookie
}));
// app.use(express.static("public"));

app.get('/', function (req, res) {
	res.send('Hello API');
})

mongoose.connect(`mongodb://localhost:27017/myapir`, function (err) {
	if (err) throw err;
	console.log('Successfully connected');

	app.use(session({
		secret: "k12jh40918e4019u3",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
	    mongooseConnection: mongoose.connection
	  })
	}));
	// app.use(express.static("public"));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/users', UsersController);
	app.use('/products', ProductsController);
	app.use('/types', TypesController);
	app.use('/manufacturers', ManufacturersController);
	app.use('/upload', ImageController);
	app.use('/bag', BagController);
	app.listen(3014, function () {
		console.log('API app started');
	})
})
