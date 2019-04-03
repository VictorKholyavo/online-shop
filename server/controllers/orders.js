const express = require('express');
let app = express();
const Orders = require('../schemas/orders');
const Products = require('../schemas/products');
const Statuses = require('../schemas/statuses');
const Payment = require('../schemas/payment');
const Delivery = require('../schemas/delivery');
const role = require('../middleware/permissions');
const passport = require('passport');

const ordersToClient = async (order) => {
	let product = await Products.findById(order.productId).lean().exec();
	let status = await Statuses.findById(order.status).lean().exec();
	let payment = await Payment.findById(order.payment).lean().exec();
	let delivery = await Delivery.findById(order.delivery).lean().exec();
	order.productTitle = product.name;
	order.statusTitle = status.value;
	order.statusIndex = status.index;
	order.paymentTitle = payment.value;
	order.deliveryTitle = delivery.value;
	order.id = order._id.toHexString();
	delete order._id;
	return order
}

app.get('/', role, async (req, res, err) => {
	try {
		const orders = await Orders.find().lean().exec();
		let sendData = await Promise.all(orders.map(ordersToClient));
		Promise.all(sendData).then((completed) => res.send(completed));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get('/:id', async (req, res, err) => {
	try {
		const orders = await Orders.find({buyerId: req.user._id}).populate('productId').populate('delivery').populate('payment').populate('status').exec();
		console.log(orders);
		res.send(orders.map((order) => order.toClient()));
		// let sendData = await Promise.all(orders.map(ordersToClient));
		// Promise.all(sendData).then((completed) => res.send(completed));
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
				console.log(docs);
				res.send(docs.toClient());
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
