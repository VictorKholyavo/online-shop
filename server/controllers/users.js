const express = require('express');
const app = express();
const session = require("express-session");
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Bag = require('../schemas/bag');
const User = require('../schemas/users');
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
/*  PASSPORT SETUP  */
const passport = require('passport');
const role = require('../middleware/permissions');

app.get('/', passport.authenticate('jwt', {session: false}), role, async (req, res) => {
	try {
		const users = await User.find().exec();
		res.send(users.map(user => user.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

/* PASSPORT LOCAL AUTHENTICATION */
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey   : "secret for token"
    },
    function (jwtPayload, cb) {
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

app.post("/login", (req, res, next) => {
	passport.authenticate('local', {session: false},
		function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(403).send('Укажите правильный email или пароль!');
			}
			req.logIn(user, {session: false}, function(err) {
				if (err) {
					return next(err);
				}
				const token = jwt.sign({id: user._id}, "secret for token")
	      return res.json({username: user.username, token: token});
			});
	})(req, res, next);
});

app.get("/getInfo", passport.authenticate('jwt', {session: false}), role, async (req, res, next) => {
	return res.json({username: req.user.username, admin: true});
})

app.post("/login/status", passport.authenticate('jwt', {session: false}), async (req, res, next) => {
	if (req.user) {
		let token = jwt.sign({id: req.user._id}, "secret for token");
		return res.json({username: req.user.username, token: token});
	}
	return res.json(null);
});

app.post("/logout", (req, res) => {
	req.logout();
	res.json({});
});

app.post('/registration', async (req, res, next) => {
	try {
		if (req.body.email && req.body.password) {
			let newUser = await new User({
				email: req.body.email,
				password: req.body.password,
				username: req.body.username
			});
			newUser.save(function (err, docs) {
				if (err) {
					return res.status(401).send("Email already registered")
				}
				let addUserBag = new Bag({
					buyerId: docs._id,
					productId: req.body.productId,
					amount: req.body.amount
				});
				addUserBag.save(function (err, docs) {
					passport.authenticate('local', {session: false},
						function(err, user) {
							req.logIn(user, {session: false}, function(err) {
								if (err) {
									return next(err);
								}
								const token = jwt.sign({id: user._id}, "secret for token")
					      return res.json({userId: user._id, token: token});
							});
					})(req, res, next);
				});
			});
		}
	}
	catch (error) {
		res.status(500).send("Something broke");
	}
});

app.put('/:id', passport.authenticate('jwt', {session: false}), role, async (req, res, err) => {
	try {
		await User.findOneAndUpdate(
			{_id: req.body.id},
			{
				$set: {
					username: req.body.username,
					email: req.body.email
				}
			},
			{
				new: true
			},
			function (err, docs) {
				res.send(docs.toClient());
			}
		);
	} catch (error) {
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
