const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	product: {
		type: String,
    required: true
	},
	amount: {
		type: Number,
    required: true
	},
	// buyerId: {
	// 	type: String,
	// 	required: true
	// },
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
		type: String,
    required: true
	},
	payment: {
		type: String,
    required: true
	},
	date: {
    type: Date,
    default: Date.now,
  },
	status: {
		type: String,
    default: "In process"
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
