const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	type: {
		type: String,
    required: true
	},
	manufacturer: {
		type: String,
    required: true
	},
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
  },
	rating: {
		type: Number,
		default: 0
	},
	image: {
		type: String,
	}
});

ProductSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product
