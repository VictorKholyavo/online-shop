const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = require('../schemas/types');
const uniqueValidator = require('mongoose-unique-validator');

const ManufactureSchema = new Schema({
	title: {
		type: String,
    required: true,
		unique: true
	},
	types: [{
		type: Schema.Types.ObjectId,
		ref: 'Type'
	}]
});

ManufactureSchema.plugin(uniqueValidator);

ManufactureSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();

  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Manufacture = mongoose.model('Manufacture', ManufactureSchema);

module.exports = Manufacture
