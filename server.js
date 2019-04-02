const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const ejwt = require('express-jwt');
// const User = require('./server/schemas/users');
const UsersController = require('./server/controllers/users');
const AdminsController = require('./server/controllers/admins');
const ProductsController = require('./server/controllers/products');
const StatusesController = require('./server/controllers/statuses');
const PaymentController = require('./server/controllers/payment');
const DeliveryController = require('./server/controllers/delivery');
const TypesController = require('./server/controllers/types');
const ManufacturersController = require('./server/controllers/manufacturers');
const ImageController = require('./server/controllers/images');
const BagController = require('./server/controllers/bag');
const OrderController = require('./server/controllers/orders');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
// const FileStore = require("session-file-store")(session);
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

app.use(cors(
	// {
	// 	origin:['http://127.0.0.1:8080'],
	// 	methods:['GET','POST'],
	// 	credentials: true // enable set cookie
	// }
));

app.get('/', function (req, res) {
	res.send('Hello API');
})

mongoose.connect(`mongodb://localhost:27017/myapir`, function (err) {
	if (err) throw err;
	console.log('Successfully connected');

	app.use(express.static("public"));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/users', UsersController);
	app.use('/admins', AdminsController);
	app.use('/products', passport.authenticate('jwt', {session: false}), ProductsController);
	app.use('/statuses', passport.authenticate('jwt', {session: false}), StatusesController);
	app.use('/payment', passport.authenticate('jwt', {session: false}), PaymentController);
	app.use('/delivery', passport.authenticate('jwt', {session: false}), DeliveryController);
	app.use('/types', passport.authenticate('jwt', {session: false}), TypesController);
	app.use('/manufacturers', passport.authenticate('jwt', {session: false}), ManufacturersController);
	app.use('/upload', passport.authenticate('jwt', {session: false}), ImageController);
	app.use('/bag', passport.authenticate('jwt', {session: false}), BagController);
	app.use('/orders', passport.authenticate('jwt', {session: false}), OrderController);
	app.listen(3014, function () {
		console.log('API app started');
	})
})
