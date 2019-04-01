const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Products = require('../schemas/products');

const BagSchema = new Schema({
	buyerId: {
		type: String,
		required: true
	},
	products: []
});

BagSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

BagSchema.statics.findProduct = function findProduct(productId, callback) {
	Products.findById(
		productId,
		function (err, doc) {
			if (err) {
				let error = "No groups found";
				return callback(error);
			}
			else {
				return callback(null, doc)
			}
		}
	);
}
// Компилируем модель из схемы
const Bag = mongoose.model('Bag', BagSchema);

module.exports = Bag
