const express = require('express');
let app = express();
const mongoose = require('mongoose');
const Manufacturers = require('../schemas/manufacturers');
const Types = require('../schemas/types');

app.get('/', async (req, res) => {
	try {
		// const manufacturers = await Manufacturers.find().exec();
		//
		//
		// 	let startDataPhones = ["iPhone", "Samsung", "Huawei"];
		// 	for (let i = 0; i < startDataPhones.length; i++) {
		// 		await Types.findOne({value: "Phones"}, async(err, docs) => {
		// 			let newManufacture = await new Manufacturers({
		// 				value: startDataPhones[i],
		// 				type: docs._id
		// 			});
		// 			newManufacture.save();
		// 			await Types.findOneAndUpdate(
		// 				{ value: "Phones" },
		// 				{
		// 					$push: {
		// 						manufacturers: newManufacture
		// 					}
		// 				},
		// 				{
		// 					new: true,
		// 					upsert: false
		// 				}
		// 			);
		// 		})
		// 	}
		// 	//
		// 	// let startDataNotebooks = ["HP", "Acer", "Asus"];
		// 	//
		// }
		res.send(manufacturers.map(manufacture => manufacture.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.get('/all', async (req, res) => {
	try {
		const manufacturers = await Manufacturers.find().exec();
		for (let i = 0; i < manufacturers.length; i++) {
			await Types.findById(manufacturers[i].type, function (err, docs) {
				manufacturers[i].typeByString = docs.value;
			})
		}
		res.send(manufacturers.map(manufacture => manufacture.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.post('/startData', async (req, res) => {
	try {
		let startDataPhones = ["iPhone", "Samsung", "Huawei"];
		let startDataNotebooks = ["HP", "Acer", "Asus"];
		let startDataTV = ["Sony"];
		for (let i = 0; i < startDataPhones.length; i++) {
			await Types.findOne({value: "Phones"}, async(err, docs) => {
				let newManufacture = await new Manufacturers({
					value: startDataPhones[i],
					type: docs._id
				});
				newManufacture.save();
				await Types.findOneAndUpdate(
					{ value: "Phones" },
					{
						$push: {
							manufacturers: newManufacture
						}
					},
					{
						new: true,
						upsert: false
					}
				);
			})
		}
		for (let i = 0; i < startDataNotebooks.length; i++) {
			await Types.findOne({value: "Notebooks"}, async(err, docs) => {
				let newManufacture = await new Manufacturers({
					value: startDataNotebooks[i],
					type: docs._id
				});
				newManufacture.save();
				await Types.findOneAndUpdate(
					{ value: "Notebooks" },
					{
						$push: {
							manufacturers: newManufacture
						}
					},
					{
						new: true,
						upsert: false
					}
				);
			})
		}
		for (let i = 0; i < startDataTV.length; i++) {
			await Types.findOne({value: "TV"}, async(err, docs) => {
				let newManufacture = await new Manufacturers({
					value: startDataTV[i],
					type: docs._id
				});
				newManufacture.save();
				await Types.findOneAndUpdate(
					{ value: "TV" },
					{
						$push: {
							manufacturers: newManufacture
						}
					},
					{
						new: true,
						upsert: false
					}
				);
			})
		}
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/', async (req, res) => {
	try {
		let newManufacture = await new Manufacturers({
			value: req.body.value,
			type: req.body.type
		});
		newManufacture.save(function(err, docs) {
			if (err) {
				return res.status(401).send("Can't add new manufacture")
			}
			return res.json(newManufacture)
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

app.delete('/:id', async (req, res) => {
	try {
		await Manufacturers.findOneAndRemove(
			{ _id: req.params.id },
		);
		res.send({id: req.params.id})
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

module.exports = app
