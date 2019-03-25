const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema ({
  path:  { type: String },
  caption: { type: String }
});

module.exports = mongoose.model('Photos', PhotoSchema);
