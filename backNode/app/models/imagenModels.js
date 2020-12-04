const mongoose = require('mongoose');

let imagenScheme = new mongoose.Schema({
    rutaImagen: { type: String, required: true },
    nombreImagen: { type: String, required: true },
    modificada: { type: Boolean },
    urlAWSOriginal: { type: String, required: true },
    alto_orig: { type: String },
    ancho_orig: { type: String },
    urlAWSModificada: { type: String },
    alto_new: { type: String },
    ancho_new: { type: String },
    horizontal: { type: Boolean }
});

mongoose.model('imagen', imagenScheme);
module.exports = mongoose.model('imagen');
