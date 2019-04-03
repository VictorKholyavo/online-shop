const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Statuses = require('../schemas/statuses');
const Delivery = require('../schemas/delivery');
const Products = require('../schemas/products');

const OrderSchema = new Schema({
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	},
	amount: {
		type: Number,
    required: true
	},
	buyerId: {
		type: String,
		required: true
	},
	buyerName: {
		type: String,
    required: true
	},
	buyerEmail: {
		type: String,
    required: true
	},
	phone: {
		type: String,
    required: true
	},
	address: {
		type: String,
    required: true
	},
	delivery: {
		type: Schema.Types.ObjectId,
		ref: 'Delivery'
	},
	payment: {
		type: Schema.Types.ObjectId,
		ref: 'Payment'
	},
	date: {
    type: Date,
    default: Date.now,
  },
	status: {
		type: Schema.Types.ObjectId,
		ref: 'Statuses'
	},
	statusDescription: {
		type: String
	}
});

OrderSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order
