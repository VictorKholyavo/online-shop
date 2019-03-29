const express = require('express');
let app = express();
const Delivery = require('../schemas/delivery');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', passport.authenticate('jwt', {session: false}), async (req, res, err) => {
	try {
		const deliveries = await Delivery.find().exec();
			res.json(deliveries.map(delivery => delivery.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', passport.authenticate('jwt', {session: false}), role, async (req, res) => {
	try {
		let startDataIndex = ["master", "pickup"];
		let startDataDelivery = ["Master", "Pick Up"];
		for (let i = 0; i < startDataDelivery.length; i++) {
			let newDelivery = await new Delivery ({
				index: startDataIndex[i],
				value: startDataDelivery[i]
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

// app.post('/', async (req, res) => {
// 	try {
// 		let newType = await new Types({
// 			value: req.body.value
// 		});
// 		newType.save(function(err, docs) {
// 			if (err) {
// 				return res.status(401).send("Can't add new type")
// 			}
// 			return res.json(newType)
// 		});
// 	} catch (error) {
// 		res.status(500).send("Something broke");
// 	}
// })

// app.delete('/:id', async (req, res) => {
// 	try {
// 		await Types.findOneAndRemove(
// 			{ _id: req.params.id },
// 		);
// 		res.send({id: req.params.id})
// 	} catch (error) {
// 		res.status(500).send("Something broke");
// 	}
// });

module.exports = app
