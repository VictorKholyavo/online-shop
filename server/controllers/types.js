const express = require('express');
let app = express();
const mongoose = require('mongoose');
const Types = require('../schemas/types');
const Manufacturers = require('../schemas/manufacturers');
const passport = require('passport');

app.get('/', async (req, res) => {
	try {
		const types = await Types.find().populate('manufacturers').lean().exec(function (err, types) {
			return res.json(types.map(function (type) {
				type.id = type._id;
				type.$id = type._id;
				delete type._id;
				type.manufacturers.map(function (manufacture) {
					manufacture.$id = manufacture._id;

					return manufacture
				});
				type.data = type.manufacturers;
				delete type.manufacturers;
				return type
			}));
		});
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/', async (req, res) => {
	try {
		let newType = await new Types({
			title: req.body.title,
			manufacturers: req.body.manufacturer
		});
		newType.save(async (err, type) => {
			if (err) {
				let typePresented = await Types.findOne({title: req.body.title}).lean();
				for (let i = 0; i < typePresented.manufacturers.length; i++) {
					typePresented.manufacturers[i] = typePresented.manufacturers[i].toHexString();
					if (typePresented.manufacturers[i] === req.body.manufacturer) {							// Check the manufacturer in existed type
						return res.status(422).send("This type in this manufacturer already exists");		// If manufacturer in this type exists - return error
					}
				};
				Types.findOneAndUpdate(																										// If not, add manufacturer to this type
					{title: req.body.title},
					{
						$push: {
							manufacturers: req.body.manufacturer
						}
					},
					{
						new: true,
						upsert: false
					},
					function (err, updatedType) {
						return res.send(updatedType);
					}
				);
			}
			else {
				return res.send(type);
			}
		})
	} catch (e) {

	}
})

// app.post('/', async (req, res) => {
// 	try {
// 		let manufacturer = await Manufacturers.findById(req.body.manufacturer).lean();
// 		let newType = await new Types({
// 			title: req.body.title
// 		});
// 		newType.save(async (err, type) => {
// 			if (err) {																																		// If type already exists
// 				let typePresented = await Types.findOne({title: req.body.title}).exec(function (err, type) {
// 					for (let i = 0; i < type.manufacturers.length; i++) {
// 						type.manufacturers[i].id = type.manufacturers[i].id.toHexString();
// 						if (type.manufacturers[i].id === req.body.manufacturer) {							// Check the manufacturer in existed type
// 							return res.status(422).send("This type in this manufacturer already exists");		// If type in this manufacturer exists - return error
// 						}
// 					}
// 					Types.findOneAndUpdate(																										// If not, add manufacturer to this type
// 						{_id: type._id},
// 						{
// 							$push: {
// 								manufacturers: {id: manufacturer._id, manufacturerTitle: manufacturer.title}
// 							}
// 						},
// 						{
// 							new: true,
// 							upsert: false
// 						},
// 						function (err, doc) {
// 							Manufacturers.findOneAndUpdate(																					// And add this type to this manufacturer
// 								{_id: req.body.manufacturer},
// 								{
// 									$push: {
// 										types: {id: type._id, typeTitle: type.title}
// 									}
// 								},
// 								{
// 									new: true,
// 									upsert: false
// 								},
// 								function (err, man) {
// 									res.send(man)
// 								}
// 							)
// 						}
// 					)
// 				});
// 			}
// 			else {
// 				Types.findOneAndUpdate(																												// If type does not exist
// 					{_id: type._id},
// 					{
// 						$push: {
// 							manufacturers: {id: manufacturer._id, manufacturerTitle: manufacturer.title}
// 						}
// 					},
// 					{
// 						new: true,
// 						upsert: false
// 					},
// 					function (err, doc) {
// 						Manufacturers.findOneAndUpdate(
// 							{_id: req.body.manufacturer},
// 							{
// 								$push: {
// 									types: {id: type._id, typeTitle: type.title}
// 								}
// 							},
// 							{
// 								new: true,
// 								upsert: false
// 							},
// 							function (err, man) {
// 								res.send(doc)
// 							}
// 						)
// 					}
// 				)
// 			}
// 		});
// 	} catch (error) {
// 		res.status(500).send("Something broke");
// 	}
// });

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
