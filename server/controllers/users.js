const express = require('express');
const app = express();
const session = require("express-session");
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/users');
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
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
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey   : "secret for token"
    },
    function (jwtPayload, cb) {
			// console.log(jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

			// return cb(null, jwtPayload.id)
      return User.findById(jwtPayload.id)
			.then(user => {
				return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
    }
));
passport.use(new LocalStrategy({ usernameField: "email" },
	function (username, password, done) {
		console.log('adsdasdas23');

		User.findOne({
			email: username
		}, function (err, user) {
			if (err) {
				console.log(err);
				return done(err);
			}
			if (!user) {
				console.log("err");
				return done(null, false);
			}
			if (user.password != password) {
				console.log("err");

				return done(null, false);
			}
			return done(null, user);
		});
	}
));


// passport.serializeUser(function (user, cb) {
// 	// console.log("serialize" + user);
// 	cb(null, user.id);
// });
//
// passport.deserializeUser(function (id, cb) {
// 	User.findById(id, function (err, user) {
// 		// console.log("deserialize" + user);
// 		cb(err, user);
// 	});
// });

app.post("/login", (req, res, next) => {
	console.log('11212231123');

	passport.authenticate('local', {session: false},
		function(err, user) {
			if (err) {
				console.log(err);
				return next(err);
			}
		if (!user) {
			return res.send('Укажите правильный email или пароль!');
		}
		req.logIn(user, {session: false}, function(err) {
			if (err) {
				console.log(err);

				return next(err);
			}
			// res.setHeader('Access-Control-Allow-Credentials', 'true')

			// req.session.user = user;
			// req.session.save();
			const token = jwt.sign({id: user._id}, "secret for token")

      return res.json({userId: user._id, token: token});
		});
	})(req, res, next);
});

app.post("/login/status", async (req, res, next) => {
	// console.log(req.user._id);
	// console.log(req.headers);
	// console.log(req.headers.authorization);
	// "5c98984907e5c70f70f19d32"
	if (req.headers.authorization) {
		let token = req.headers.authorization.split(' ')[1]
		decoded = jwt.verify(token, "secret for token");
		console.log(decoded.id);
		return res.json(decoded.id);
	}
	console.log('here');
	return res.json(null);
});

app.post("/logout", (req, res) => {
	req.logout();
	res.send({});
});

app.post('/registration', async (req, res) => {
	try {
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
