const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
	index: {
		type: String,
		required: true
	},
	name: {
		type: String,
    required: true
	}
});

DeliverySchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id;
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery
