const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
	value: {
		type: String,
		default: "admin"
	}
});

AdminSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  // // Rename fields:
  obj.id = obj._id.toHexString();
  delete obj._id;
  return obj;
}

// Компилируем модель из схемы
const Admins = mongoose.model('Admins', AdminSchema);

module.exports = Admins
