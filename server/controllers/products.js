const express = require('express');
let app = express();
const mongoose = require('mongoose');
const Products = require('../schemas/products');

app.get('/', async (req, res) => {
	try {
		const products = await Products.find().exec();
		res.send(products.map(product => product.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.get('/words', async (req, res) => {
	try {
		await User.findUserByToken(req.headers.authorization, async (err, userInfo) => {
			if (err) {
				return res.sendStatus(403)
			}
			else if (userInfo) {
				let userId = userInfo._id;
				await Groups.find(
					{ userId: userId }, function (err, docs) {
						let arrayOfWords = [];
						for (let i = 0; i < docs.length; i++) {
							for (let j = 0; j < docs[i].words.length; j++) {
								docs[i].words[j].groupId = docs[i]._id						// приписываем каждому слову id группы, к которой оно принадлежит
								arrayOfWords.push(docs[i].words[j]);
							}
						}
						res.send(arrayOfWords);
				});
			}
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
		// await Products.findUserByToken(req.headers.authorization, async (err, userInfo) => {
		// 	if (err) {
		// 		return res.status(403).send("User not found");
		// 	}
		// 	let newGroup = await new Groups({
		// 		title: req.body.title,
		// 		amount: req.body.amount,
		// 		userId: userInfo._id
		// 	});
		// 	Groups.collection.dropIndexes();
		// 	newGroup.save(function(err, docs) {
		// 		if (err) {
		// 			res.status(500).send("Something broke");
		// 		}
		// 		return res.send(newGroup.toClient());
		// 	});
		// });
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

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
