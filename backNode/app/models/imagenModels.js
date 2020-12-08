const mongoose = require('mongoose');

let imagenScheme = new mongoose.Schema({
    rutaImagen: { type: String, required: true },
    nombreImagen: { type: String, required: true },
    urlAWSOriginal: { type: String, required: true },
    alto_orig: { type: Number },
    ancho_orig: { type: Number },
    urlAWSModificada: { type: String },
    alto_new: { type: Number },
    ancho_new: { type: Number }
});

mongoose.model('imagen', imagenScheme);
module.exports = mongoose.model('imagen');
