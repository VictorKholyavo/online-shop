const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema({
	productId: {
		type: String,
    required: true
	},
	amount: {
		type: Number,
    required: true
	}
});

UnitSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Unit = mongoose.model('Unit', UnitSchema);

module.exports = Unit
