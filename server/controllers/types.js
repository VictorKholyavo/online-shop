const express = require('express');
let app = express();
const mongoose = require('mongoose');
const Types = require('../schemas/types');
const Manufacturers = require('../schemas/manufacturers');
const passport = require('passport');

app.get('/', async (req, res) => {
	try {
		const types = await Types.find().exec();
			res.json(types.map(type => type.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post('/startData', async (req, res) => {
	try {
		let startDataTypes = ["Phones", "Notebooks", "TV"]
		for (let i = 0; i < startDataTypes.length; i++) {
			let newType = await new Types({
				value: startDataTypes[i]
			});
			newType.save();
		}
		return res.json(startDataTypes)

	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post('/', async (req, res) => {
	try {
		console.log(req.body);
		// Types.findOneAndUpdate(
		// 	{title: req.body.title},
		// 	{
		// 		$push: {
		// 			manufacturers: req.body.manufacturer
		// 		}
		// 	},
		// 	{
		// 		new: true,
		// 		upsert: true
		// 	},
		// 	function (err, doc) {
		// 		console.log(doc);
		// 		Manufacturers.findOneAndUpdate(
		// 			{_id: req.body.manufacturer},
		// 			{
		// 				$push: {
		// 					types: doc._id
		// 				}
		// 			},
		// 			{
		// 				new: true,
		// 				upsert: false
		// 			},
		// 			function (err, manufacture) {
		// 				console.log(manufacture);
		// 				res.send(doc)
		// 			}
		// 		)
		// 	}
		// )
		let manufacturer = await Manufacturers.findById(req.body.manufacturer).lean();
		let newType = await new Types({
			title: req.body.title
		});
		newType.save(function (err, type) {
			if (err) {
				console.log(err);
			}
			console.log(type);
			for (let i = 0; i < manufacturer.types.length; i++) {
				if (manufacturer.types[i] === type._id) {
					return res.status(422).send("Type already exists");
				}
			}
			Types.findOneAndUpdate(
				{_id: type._id},
				{
					$push: {
						manufacturers: req.body.manufacturer
					}
				},
				{
					new: true,
					upsert: false
				},
				function (err, doc) {
					Manufacturers.findOneAndUpdate(
						{_id: req.body.manufacturer},
						{
							$push: {
								types: type._id
							}
						},
						{
							new: true,
							upsert: false
						},
						function (err, man) {
							res.send(doc)
						}
					)
				}
			)
		});
		// let product = await new Types ({
		// 	title: req.body.title,
		// 	amount: req.body.amount
		// });
		// await Manufacturers.findById
		// await Types.findOneAndUpdate(
		// 	{title: req.user.title},
		// 	{
		// 		$push: {
		// 			manufacturers: product
		// 		}
		// 	},
		// 	{
		// 		new: true,
		// 		upsert: false
		// 	}
		// );
		// return res.send(product);
		// let newType = await new Types({
		// 	title: req.body.title
		// });
		// newType.save(function(err, docs) {
		// 	if (err) {
		// 		return res.status(401).send("Can't add new type")
		// 	}
		// 	return res.json(newType)
		// });
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
