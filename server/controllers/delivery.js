const express = require('express');
let app = express();
const Delivery = require('../schemas/delivery');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', async (req, res, err) => {
	try {
		const deliveries = await Delivery.find().exec();
		res.send(deliveries.map(delivery => delivery.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', role, async (req, res) => {
	try {
		let startData = [{index: "master", name: "Master"}, {index: "pickup", name: "Pick Up"}];
		startData.map(async (delivery) => {
			let newDelivery = await new Delivery ({
				index: delivery.index,
				name: delivery.name
			});
			newDelivery.save();
		});
		return res.send(startData);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app
