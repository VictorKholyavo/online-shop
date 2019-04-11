const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Bag = require('../schemas/bag');
const Unit = require('../schemas/unit');
const Products = require('../schemas/products');

app.get('/', async (req, res) => {
	try {
		const bags = await Bag.find().exec();
			res.json(bags.map(bag => bag.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get('/user', async (req, res) => {
	try {
		const userBag = await Bag.findOne({buyerId: req.user._id}).exec();
		let sendData = userBag.products.map(async (oneUnitFromUserBag) => {
			const product = await Products.findById(oneUnitFromUserBag.productId).lean().exec();
			oneUnitFromUserBag.id = oneUnitFromUserBag._id.toHexString();
			oneUnitFromUserBag.name = product.name;
			oneUnitFromUserBag.price = product.price;
		return oneUnitFromUserBag
		})
		Promise.all(sendData).then((sendData) => {
			return res.send(sendData);
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.get('/user/count', async (req, res) => {
	try {
		const userBag = await Bag.findOne({buyerId: req.user._id}).exec();
		return res.send(userBag)
	}
	catch (error) {
		res.status(500).send("Something broke");
	}
});

app.put('/addProduct', async (req, res) => {
	try {
		let product = await new Unit ({
			productId: req.body.productId,
			amount: req.body.amount
		});
		await Bag.findOneAndUpdate(
			{buyerId: req.user._id},
			{
				$push: {
					products: product
				}
			},
			{
				new: true,
				upsert: false
			}
		);
		return res.send(product);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.delete('/user/:id', async (req, res) => {
	try {
		let orderId = mongoose.Types.ObjectId(req.body.id);
		await Bag.findOneAndUpdate(
			{ buyerId: req.user._id },
			{
				$pull: {
					products: {_id: orderId}
				}
			},
			{
				new: true
			},
			function (err, docs) {
				return res.json(docs.id);
			}
		);
	} catch (e) {

	}
});

app.put('/user/clearBag', async (req, res) => {
	try {
		let orderId = mongoose.Types.ObjectId(req.body.id);
		await Bag.findOneAndUpdate(
			{ buyerId: req.user._id },
			{
				$set: {
					products: []
				}
			}
		);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

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
