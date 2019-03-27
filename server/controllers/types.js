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
