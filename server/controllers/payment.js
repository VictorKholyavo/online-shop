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
		let startData = [{index: "cash", name: "Cash"}, {index: "card", name: "Card"}];
		startData.map(async (payment) => {
			let newPayment = await new Payment ({
				index: payment.index,
				name: payment.name
			});
			newPayment.save();
		});
		return res.send(startData);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app
