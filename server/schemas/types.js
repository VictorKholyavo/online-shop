const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const TypeSchema = new Schema({
	title: {
		type: String,
    required: true,
		unique: true
	},
	manufacturers: [{
		type: Schema.Types.ObjectId,
		ref: 'Manufacture'
	}]
});

TypeSchema.plugin(uniqueValidator);

TypeSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
	obj.data = obj.manufacturers;
	obj.value = obj.title;
	// for (let i = 0; i < obj.data.length; i++) {
	// 	obj.data[i].id = obj.data[i]._id.toHexString();
	// 	delete obj.data[i]._id
	// }
  obj.id = obj._id.toHexString();
	delete obj.manufacturers;
	delete obj.title;
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Type = mongoose.model('Type', TypeSchema);

module.exports = Type
