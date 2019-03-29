const express = require('express');
const app = express();
const session = require("express-session");
const jwt = require('jsonwebtoken');
const Bag = require('../schemas/bag');
const User = require('../schemas/users');
const Admins = require('../schemas/admins');
/*  PASSPORT SETUP  */

app.get('/', async (req, res) => {
	try {
		const admins = await Admins.find().exec();
		res.send(admins.map(admin => admin.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

// app.post("/login", (req, res, next) => {
// 	passport.authenticate('local', {session: false},
// 		function(err, user) {
// 			if (err) {
// 				return next(err);
// 			}
// 		if (!user) {
// 			return res.send('Укажите правильный email или пароль!');
// 		}
// 		req.logIn(user, {session: false}, function(err) {
// 			if (err) {
// 				return next(err);
// 			}
// 			// res.setHeader('Access-Control-Allow-Credentials', 'true')
//
// 			const token = jwt.sign({id: user._id}, "secret for token")
//       return res.json({userId: user._id, token: token});
// 		});
// 	})(req, res, next);
// });

app.post("/addadmin", async (req, res) => {
	try {
		if (req.body.email && req.body.password) {
			let newUser = await new User({
				email: req.body.email,
				password: req.body.password
			});
			newUser.save(function (err, docs) {
				let addUserBag = new Bag({
					buyerId: docs._id,
					productId: req.body.productId,
					amount: req.body.amount
				});
				addUserBag.save();
				let newAdmin = new Admins({
					userId: newUser._id
				});
				newAdmin.save();
				return res.json(newAdmin)
			});
		}
	} catch (err) {

	}
});

app.post('/registration', async (req, res) => {
	try {
		if (req.body.email && req.body.password) {
			let newUser = await new User({
				email: req.body.email,
				password: req.body.password
			});

			newUser.save(function (err, docs) {
				let addUserBag = new Bag({
					buyerId: docs._id,
					productId: req.body.productId,
					amount: req.body.amount
				});
				addUserBag.save();
			});

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
