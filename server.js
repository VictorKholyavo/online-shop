const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const User = require('./server/schemas/users');
const UsersController = require('./server/controllers/users');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
// const FileStore = require("session-file-store")(session);
const MongoStore = require('connect-mongo')(session);

app.use(cors());
app.use(express.static(path.join(__dirname, '../')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(session({
	secret: "k12jh40918e4019u3",
	resave: true,
	saveUninitialized: true,
	cookie: { 
		maxAge: 24 * 60 * 60 * 1000 
	},
	store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // Keeps session open for 1 day
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
	res.send('Hello API');
})

mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:27017/myapir`, function (err) {
	if (err) throw err;
	console.log('Successfully connected');

	app.use('/users', UsersController);

	app.listen(3014, function () {
		console.log('API app started');
	})
})
