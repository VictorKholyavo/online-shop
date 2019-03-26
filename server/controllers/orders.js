const express = require('express');
let app = express();
const Orders = require('../schemas/orders');

app.get('/', async (req, res) => {
	try {
		const orders = await Orders.find().exec();
			res.json(orders.map(order => order.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post('/add', async (req, res) => {
	try {
		console.log(req.body);
		return res.send(req.body)
		// for (let i = 0; i < startDataTypes.length; i++) {
		// 	let newType = await new Types({
		// 		value: startDataTypes[i]
		// 	});
		// 	newType.save();
		// }
		// return res.json(startDataTypes)

	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post('/', async (req, res) => {
	try {
		let newType = await new Types({
			value: req.body.value
		});
		newType.save(function(err, docs) {
			if (err) {
				return res.status(401).send("Can't add new type")
			}
			return res.json(newType)
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.delete('/:id', async (req, res) => {
	try {
		await Types.findOneAndRemove(
			{ _id: req.params.id },
		);
		res.send({id: req.params.id})
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

module.exports = app
