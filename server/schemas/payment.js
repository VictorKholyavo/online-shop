const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	name: {
		type: String,
    required: true
	}
});

// Компилируем модель из схемы
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment
