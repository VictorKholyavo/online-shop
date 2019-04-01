const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = require('../schemas/types');

const ManufactureSchema = new Schema({
	value: {
		type: String,
    required: true
	},
	type: {
		type: String,
		required: true
	},
	products: []
});

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
