const express = require('express');
let app = express();
const Delivery = require('../schemas/delivery');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', async (req, res, err) => {
	try {
		const deliveries = await Delivery.find().exec();
		res.json(deliveries);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', role, async (req, res) => {
	try {
		let startDataId = ["master", "pickup"];
		let startDataDelivery = ["Master", "Pick Up"];
		for (let i = 0; i < startDataDelivery.length; i++) {
			let newDelivery = await new Delivery ({
				_id: startDataId[i],
				name: startDataDelivery[i]
			});
			newDelivery.save(function (err, docs) {
				console.log(docs);
			})
		}
		return res.send(startDataDelivery);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app
