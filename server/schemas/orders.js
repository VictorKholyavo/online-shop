const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Statuses = require('../schemas/statuses');

const OrderSchema = new Schema({
	productId: {
		type: String,
    required: true
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
		type: String,
    required: true
	},
	payment: {
		type: String
	},
	date: {
    type: Date,
    default: Date.now,
  },
	status: {
		type: String
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

// {
// 	let product = await Products.findById(order.productId).lean().exec();
// 	let status = await Statuses.findById(order.status).lean().exec();
// 	let payment = await Payment.findById(order.payment).lean().exec();
// 	let delivery = await Delivery.findById(order.delivery).lean().exec();
// 	order.productTitle = product.name;
// 	order.statusTitle = status.value;
// 	order.paymentTitle = payment.value;
// 	order.deliveryTitle = delivery.value;
// 	order.id = order._id.toHexString();
// 	delete order._id;
// 	return order;
// }


OrderSchema.statics.findStatus = function findStatus(id, callback) {
	Statuses.findById(
		id,
		function (err, doc) {
			//doc.findByToken()
			if (err) {
				let error = "No statuses found";
				return callback(error);
			}
			else {
				return callback(null, doc)
			}
		}
	);
}
// Компилируем модель из схемы
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order
