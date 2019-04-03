const express = require('express');
let app = express();
const Payment = require('../schemas/payment');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', async (req, res, err) => {
	try {
		const payments = await Payment.find().exec();
		res.send(payments.map(payment => payment.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', role, async (req, res) => {
	try {
		let startDataIndex = ["cash", "card"];
		let startDataPayment = ["Cash", "Card"];
		for (let i = 0; i < startDataPayment.length; i++) {
			let newPayment = await new Payment ({
				index: startDataIndex[i],
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
