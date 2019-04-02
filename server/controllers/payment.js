const express = require('express');
let app = express();
const Payment = require('../schemas/payment');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', async (req, res, err) => {
	try {
		const payments = await Payment.find().exec();
		console.log(payments);
		res.json(payments);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', role, async (req, res) => {
	try {
		let startDataId = ["cash", "card"];
		let startDataPayment = ["Cash", "Card"];
		for (let i = 0; i < startDataPayment.length; i++) {
			let newPayment = await new Payment ({
				_id: startDataId[i],
				name: startDataPayment[i]
			});
			newPayment.save(function (err, docs) {
				console.log(docs);
			})
		}
		return res.send(startDataPayment);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app
