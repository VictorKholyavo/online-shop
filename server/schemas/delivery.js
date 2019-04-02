const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
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
const Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery
