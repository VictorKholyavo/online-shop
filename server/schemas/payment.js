const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
	index: {
		type: String,
		required: true
	},
	name: {
		type: String,
    required: true
	}
});

PaymentSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id;
  delete obj._id;
  return obj;
}
// Компилируем модель из схемы
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment
