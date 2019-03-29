const express = require('express');
let app = express();
const Statuses = require('../schemas/statuses');
const role = require('../middleware/permissions');
const passport = require('passport');

app.get('/', passport.authenticate('jwt', {session: false}), role, async (req, res, err) => {
	try {
		const statuses = await Statuses.find().exec();
			res.json(statuses.map(status => status.toClient()));
	} catch (error) {
		res.status(500).send("Something broke");
	}
});

app.post('/startData', passport.authenticate('jwt', {session: false}), role, async (req, res) => {
	try {
		let startDataIndex = ["inprocess", "declined"]
		let startDataStatuses = ["In process", "Declined"]
		let startDataDescription = [null, "Not in stock"]
		for (let i = 0; i < startDataStatuses.length; i++) {
			let newStatus = await new Statuses ({
				index: startDataIndex[i],
				value: startDataStatuses[i],
				description: startDataDescription[i]
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

// app.post('/', async (req, res) => {
// 	try {
// 		let newType = await new Types({
// 			value: req.body.value
// 		});
// 		newType.save(function(err, docs) {
// 			if (err) {
// 				return res.status(401).send("Can't add new type")
// 			}
// 			return res.json(newType)
// 		});
// 	} catch (error) {
// 		res.status(500).send("Something broke");
// 	}
// })

// app.delete('/:id', async (req, res) => {
// 	try {
// 		await Types.findOneAndRemove(
// 			{ _id: req.params.id },
// 		);
// 		res.send({id: req.params.id})
// 	} catch (error) {
// 		res.status(500).send("Something broke");
// 	}
// });

module.exports = app
