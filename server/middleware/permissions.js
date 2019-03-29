const express = require('express');
const app = express();
const User = require('../schemas/users');
const Admins = require('../schemas/admins');

module.exports = async (req, res, cb) => {
		// console.log(req.user);
		// return cb(null, jwtPayload.id)
		 // function (req.user, cb) {
	return Admins.findOne({userId:  req.user._id})
		.then(admin => {
			if (admin) {
				return cb(null, admin);
			}
			res.json({userInfo: req.user})
			// res.status(550).send("You don't have permission to view this page");
		})
		.catch(err => {
			console.log("err");
			return cb(err);
		});
}

		// console.log(jwtPayload);
		//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
