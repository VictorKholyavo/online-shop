const express = require('express');
let app = express();
const mongoose = require('mongoose');
const Products = require('../schemas/products');
const passport = require('passport');

app.get('/', async (req, res) => {
	try {
		const products = await Products.find().exec();
		res.send(products.map(product => product.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/product', async (req, res) => {
	try {
		const product = await Products.findById(req.body.productId, function (err, docs) {
			res.send(docs.toClient())
		})
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/', async (req, res) => {
	try {
		let newProduct = await new Products({
			type: req.body.type,
			manufacturer: req.body.manufacturer,
			name: req.body.name,
			price: req.body.price,
			image: req.body.image
		});
		newProduct.save(function(err, docs) {
			if (err) {
				return res.status(401).send("Can't add new product")
			}
			return res.json(newProduct)
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
})
app.put('/:id', async (req, res, err) => {
	try {
		req.body.rating = parseInt(req.body.rating, 10)
		await Products.findOneAndUpdate(
			{_id: req.body.productId},
			{
				$set: {
					rating: req.body.rating + 1
				}
			},
			{
				new: true
			},
			function (err, docs) {
				res.send(docs.toClient());
			}
		);
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.delete('/:id', async (req, res) => {
	try {
		await Products.findOneAndRemove(
			{ _id: req.params.id },
		);
		res.send({id: req.params.id})
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

module.exports = app
