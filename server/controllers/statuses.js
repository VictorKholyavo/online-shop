const express = require('express');
let app = express();
const Statuses = require('../schemas/statuses');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', role, async (req, res, err) => {
	try {
		const statuses = await Statuses.find().exec();
			res.json(statuses.map(status => status.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/status', async (req, res, err) => {
	try {
		const status = await Statuses.findById(req.body.statusId).exec();
		return res.json(status.toClient());
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', role, async (req, res) => {
	try {
		let startDataIndex = ["inprocess", "declined"]
		let startDataStatuses = ["In process", "Declined"]
		for (let i = 0; i < startDataStatuses.length; i++) {
			let newStatus = await new Statuses ({
				index: startDataIndex[i],
				value: startDataStatuses[i]
			});
			newStatus.save(function (err, docs) {
				console.log(docs);
			})
		}
		return res.send(startDataStatuses);
	} catch (error) {
		res.status(500).send("Something broke");
	}
})

module.exports = app
