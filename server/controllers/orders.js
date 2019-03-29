const express = require('express');
let app = express();
const Orders = require('../schemas/orders');
const Statuses = require('../schemas/statuses');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', passport.authenticate('jwt', {session: false}), role, async (req, res, err) => {
	try {
		const orders = await Orders.find().exec();
			res.json(orders.map(order => order.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res, err) => {
	try {
		const orders = await Orders.find({buyerId: req.user._id}).exec();
		// let userId = userInfo._id;
		let sendData = []
		for (let i = 0; i < orders.length; i++) {
			await Orders.findStatus(orders[i].status, function(err, status){
				orders[i].status = status.value
				sendData.push(orders[i]);
				// return res.send(groups.map(group => group.toClient()));
			})
		}
		console.log(sendData);
		return res.json(orders.map(async (order) => {
			await Orders.findStatus(order.status, function(err, status) {
				order.status = status.value;
			})
			order.id = order._id.toHexString();
			delete order._id;
			return order;
		}));
		// res.json(orders.map(order => order.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/add', async (req, res) => {
	try {
		console.log(req.body);
		const statusInProcess = await Statuses.findOne({index: "inprocess"}).exec();
		console.log(statusInProcess);
		let newOrder = await new Orders ({
			productId: req.body.productId,
			amount: req.body.amount,
			buyerId: req.body.buyerId,
			buyerName: req.body.buyerName,
			buyerEmail: req.body.buyerEmail,
			phone: req.body.phone,
			address: req.body.address,
			delivery: req.body.delivery,
			payment: req.body.payment,
			status: statusInProcess._id
		});
		newOrder.save()
		return res.send(newOrder);
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
