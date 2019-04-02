const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const TypeSchema = new Schema({
	title: {
		type: String,
    required: true
	},
	manufacturers: []
});

TypeSchema.plugin(uniqueValidator);

TypeSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
	// obj.data = obj.manufacturers;
	// for (let i = 0; i < obj.data.length; i++) {
	// 	obj.data[i].id = obj.data[i]._id.toHexString();
	// 	delete obj.data[i]._id
	// }
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Type = mongoose.model('Type', TypeSchema);

module.exports = Type
