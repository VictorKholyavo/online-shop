const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
	index: {
		type: String,
		required: true
	},
	value: {
		type: String,
    required: true
	},
	description: {
		type: String
	}
});

StatusSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Statuses = mongoose.model('Statuses', StatusSchema);

module.exports = Statuses
