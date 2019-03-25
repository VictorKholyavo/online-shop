const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
	value: {
		type: String,
    required: true
	},
	manufacturers: []
});

TypeSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Type = mongoose.model('Type', TypeSchema);

module.exports = Type
