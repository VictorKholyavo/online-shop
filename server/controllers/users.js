const express = require('express');
const app = express();
const session = require("express-session")
// const jwt = require('jsonwebtoken');
// const exjwt = require('express-jwt');
// const bcrypt = require('bcrypt');
const User = require('../schemas/users');
const LocalStrategy = require("passport-local").Strategy;

/*  PASSPORT SETUP  */
const passport = require('passport');

app.get('/', async (req, res) => {
	try {
		const users = await User.find().exec();
		res.send(users.map(user => user.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

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

//   const auth = (req, res, next) => {
// 	if (req.isAuthenticated()) {
// 		console.log(req.session);
// 		console.log("You are in");
// 	  	next();
// 	} else {
// 		console.log(req.session);
// 		console.log("NO WAY!");
// 	 	return res.send({a: "NO WAY!"});
// 	}
//   };

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
			req.session.passport = user;
			console.log(typeof(req.session.passport));
			console.log(typeof(user));
			console.log("LOGIN SESSION")
			console.log(req.session.passport)
			return res.send(req.session.passport);
		});
	})(req, res, next);
});

app.post("/status", (req, res) => {
	console.log("status: ")
	console.log(req.session.passport);
	return res.send(req.session.passport || {a: "ERROR"});
});
app.post("/logout", (req, res) => {
	delete req.session.passport;
	res.send({});
});


//   app.get('/admin', auth, (req, res) => {
// 	console.log(req.session);
// 	res.send('Admin page!');
//   });

//   app.get('/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
//   });
// app.get('/status', async (req, res) => {
// 	try {
// 		await User.findUserByToken(req.headers.authorization, function(err, userInfo) {
// 			if (err) {
// 				return res.status(403).send("You must be logged to see this page");
// 			}
// 			return res.json({token: req.body.token, username: userInfo.username});
// 		})
// 	}
// 	catch (error) {
// 		return res.status(403).send("You must be logged to see this page");
// 	}
// })

// app.post('/login', async (req, res) => {
// 	try {
// 		User.authenticate(req.body.email, req.body.password, function (error, user) {
// 			if (!user) {
// 				console.log('Wrong email or password.');
// 				res.sendStatus(403)
// 			} else {
// 				let token = jwt.sign({ email: req.body.email, password: req.body.password }, 'keyboard', { expiresIn: 129600 }); // Sigining the token
// 				User.findOneAndUpdate(
// 					{ _id: user._id },
// 					{
// 						$set: {
// 							token: token,
// 						}
// 					},
// 					function (err, doc) {
// 						res.json({token:token, _id: doc._id, username: doc.username});
// 					}
// 				)
// 			}
// 		})
// 	} catch (e) {
// 		res.sendStatus(403)
// 	}
// })
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
// app.post('/registration', async (req, res) => {
// 	try {
// 		if (req.body.email && req.body.username && req.body.password) {
// 			let newUser = await new User({
// 				email: req.body.email,
// 				username: req.body.username,
// 				password: req.body.password,
// 				token: "inactive"
// 			});
// 			newUser.save(function(err, docs) {
// 				if (err) {
// 					return res.status(401).send("Email already registered")
// 				}
// 				let token = jwt.sign({ email: docs.email, password: docs.password }, 'keyboard', { expiresIn: 129600 }); // Sigining the token
// 				User.findOneAndUpdate(
// 					{ _id: docs._id },
// 					{
// 						$set: {
// 							token: token,
// 						}
// 					},
// 					function (err, doc) {
// 						Results.collection.dropIndexes();
// 						let newResultsForUser = new Results ({
// 							userId: docs._id,
// 							results: [],
// 						});
// 						newResultsForUser.save();
// 						res.json({token:token, email: doc.email, username: doc.username});
// 					}
// 				)
// 			});
// 		}
// 	} catch (error) {
// 		res.status(500).send("Something brokeasd");
// 	}
// });


// app.post('/logout', async (req, res, next) => {
// 	User.findOneAndUpdate(
// 		{ username: req.body.username},
// 		{
// 			$set: {
// 				token: "inactive",
// 			}
// 		},
// 		function (err, docs) {
// 			res.json(docs);
// 		}
// 	)
// });

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
