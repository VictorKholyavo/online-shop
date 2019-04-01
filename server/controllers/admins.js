const express = require('express');
const app = express();
const session = require("express-session");
const jwt = require('jsonwebtoken');
const Bag = require('../schemas/bag');
const User = require('../schemas/users');
const Admins = require('../schemas/admins');
/*  PASSPORT SETUP  */
const passport = require('passport');

app.get('/', async (req, res) => {
	try {
		const admins = await Admins.find().exec();
		res.send(admins.map(admin => admin.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post("/addadmin", async (req, res, next) => {
	try {
		if (req.body.email && req.body.password) {
			let newUser = await new User({
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
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
			});
		}
	} catch (err) {

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
