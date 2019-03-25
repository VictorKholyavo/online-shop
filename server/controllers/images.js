const mongoose = require('mongoose');
const express = require('express');
let app = express();
const multer  = require('multer');
const PhotoSchema = require('../schemas/images');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/', upload.single('upload'), async function(req, res) {
	const imageOne = await PhotoSchema ({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
	})
	imageOne.save();
	let path = req.file.destination + "/" + req.file.originalname;
	res.send({"server": "server", "path": path})
});

module.exports = app;
