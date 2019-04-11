const express = require('express');
let app = express();
const Orders = require('../schemas/orders');
const Products = require('../schemas/products');
const Statuses = require('../schemas/statuses');
const Payment = require('../schemas/payment');
const Delivery = require('../schemas/delivery');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', role, async (req, res, err) => {
	try {
		const orders = await Orders.find().populate('productId').populate('delivery').populate('payment').populate('status');
		res.send(orders.map(order => order.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get('/:id', async (req, res, err) => {
	try {
		const orders = await Orders.find({buyerId: req.user._id}).populate('productId').populate('delivery').populate('payment').populate('status').exec();
		res.send(orders.map((order) => order.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.put('/:id', async (req, res, err) => {
	try {
		await Orders.findOneAndUpdate(
			{_id: req.body.id},
			{
				$set: {
					status: req.body.status,
					statusDescription: req.body.statusDescription
				}
			},
			{
				new: true
			},
			function (err, docs) {
				docs.id = docs._id;
				delete docs._id;
				res.send(docs)
			}
		);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/add', async (req, res) => {
	try {
		const statusInProcess = await Statuses.findOne({index: "inprocess"}).exec();
		const delivery = await Delivery.findById(req.body.delivery).exec();
		let newOrder = await new Orders ({
			productId: req.body.productId,
			amount: req.body.amount,
			buyerId: req.user._id,
			buyerName: req.body.buyerName,
			buyerEmail: req.body.buyerEmail,
			phone: req.body.phone,
			address: req.body.address,
			delivery: req.body.delivery,
			payment: req.body.payment,
			status: statusInProcess._id
		});
		newOrder.save();
		return res.send(newOrder);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

module.exports = app
