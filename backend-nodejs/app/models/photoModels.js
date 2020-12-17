const mongoose = require('mongoose');

let imagenScheme = new mongoose.Schema({
  photoPath: { type: String, required: true },
  photoPathUpdate: { type: String },
  title: { type: String, required: true },
  idTrx: { type: String, required: true },
  urlAWSOriginal: { type: String, required: true },
  urlAWSModificada: { type: String },
  photo_height: { type: String },
  photo_width: { type: String },
  new_height: { type: String },
  new_width: { type: String },
  photo_height_web: { type: String },
  photo_width_web: { type: String },
  new_height_web: { type: String },
  new_width_web: { type: String },
  created_at: { type: Date, required: true, default: Date.now('<YYYY-mm-ddTHH:MM:ss>') },
});

mongoose.model('imagen', imagenScheme);
module.exports = mongoose.model('imagen');
