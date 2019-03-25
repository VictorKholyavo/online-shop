const express = require('express');
const app = express();
const session = require("express-session");
// const bcrypt = require('bcrypt');
const User = require('../schemas/users');
const LocalStrategy = require("passport-local").Strategy;

/*  PASSPORT SETUP  */
const passport = require('passport');

// app.get('/', async (req, res) => {
// 	try {
// 		const users = await User.find().exec();
// 		res.send(users.map(user => user.toClient()));
// 	} catch (error) {
// 		res.status(500).send("Something broke");
// 	}
// })

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(new LocalStrategy({ usernameField: "email" },
	function (username, password, done) {
		User.findOne({
			email: username
		}, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			if (user.password != password) {
				return done(null, false);
			}
			return done(null, user);
		});
	}
));
passport.serializeUser(function (user, cb) {
	// console.log("serialize" + user);
	cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
	User.findById(id, function (err, user) {
		// console.log("deserialize" + user);
		cb(err, user);
	});
});


app.post("/login", (req, res, next) => {
	passport.authenticate('local', function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send('Укажите правильный email или пароль!');
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			res.setHeader('Access-Control-Allow-Credentials', 'true')
			req.session.user = user;
			req.session.save();

			return res.send(req.session.user);
		});
	})(req, res, next);
});

app.post("/login/status", (req, res, next) => {
	return res.json(req.session.user || null);
});

app.post("/logout", (req, res) => {
	delete req.session.passport;
	res.send({});
});

app.post('/registration', async (req, res) => {
	try {
		console.log(req.body)
		if (req.body.email && req.body.password) {
			let newUser = await new User({
				email: req.body.email,
				password: req.body.password
			});
			newUser.save();
		}
	}
	catch (error) {
		res.status(500).send("Something broke");
	}
});

app.delete('/:id', async (req, res) => {
	try {
		await User.findOneAndRemove(
			{ _id: req.params.id },
		);
		res.send({ id: req.params.id })
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app;
