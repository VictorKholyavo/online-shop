const express = require('express');
const app = express();
const User = require('../schemas/users');
const Admins = require('../schemas/admins');

module.exports = async (req, res, cb) => {
	return Admins.findOne({userId:  req.user._id})
		.then(admin => {
			if (admin) {
				return cb(null, admin);
			}
			res.json({userInfo: req.user})
		})
		.catch(err => {
			console.log("err");
			return cb(err);
		});
}
