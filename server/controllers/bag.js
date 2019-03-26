const express = require('express');
let app = express();
const Bag = require('../schemas/bag');
const Products = require('../schemas/products');

app.get('/', async (req, res) => {
	try {
		const bags = await Bag.find().exec();
			res.json(bags.map(bag => bag.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})
app.get('/user', async (req, res) => {
	try {
		const userBag = await Bag.find().exec();
		let sendData = [];
		for (let i = 0; i < userBag.length; i++) {
			const product = await Products.findById(userBag[i].productId).lean().exec();
			product.amount = userBag[i].amount;
			product.sum = product.price * product.amount
			sendData.push(product)
		}
		res.send(sendData.map(doc => doc.toClient()))
		// product[0].amount = userBag[0].productId;
		// for (let i = 0; i < bags.length; i++) {
		// 	await Bag.findProduct(bags[i].productId, function(err, userProduct) {
		// 		userBag.push(userProduct);
		// 		userBag[i].amount = bags[i].amount;
		//
		// 	})
		// 	console.log(userBag);
		// }
		// return res.send(bags.map(bag => bag.toClient()));
		// res.json(product.map(bag => bag.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})
app.post('/add', async (req, res) => {
	try {
		console.log(req.body);
		let addProductToBag = await new Bag({
			productId: req.body.productId,
			amount: req.body.amount
		});
		addProductToBag.save();
		return res.json(addProductToBag)

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
