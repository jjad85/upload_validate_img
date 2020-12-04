const imagenModel = require('../models/imagenModels');
const fs = require('fs');
const AWS = require('aws-sdk');
const Jimp = require('jimp');

AWS.config.update({ region: 'us-east-2' });
const config = require('../configs/config.js');

const s3 = new AWS.S3({
    accessKeyId: config.AWSID,
    secretAccessKey: config.AWSSECRET
});

exports.uploadImagenAWS = async (rutaImagen, nombreImagen) => {
    const fileContent = fs.readFileSync(rutaImagen);
    const params = {
        Bucket: config.BUCKET_NAME,
        Key: nombreImagen,
        Body: fileContent
    };

    let a = await s3
        .upload(params, function (err, data) {
            if (err) {
                throw err;
            }
        })
        .promise();
    return a;
};

exports.insertImagenBD = async (imagen) => {
    let addResult = await imagenModel.create(imagen);
    return addResult;
};

exports.listarImagenes = async () => {
    let imagenes = await imagenModel.find();
    return imagenes;
};

exports.obtenerTamanoImagen = async (imagen) => {
    var sizeOf = require('image-size'),
        dimensions = sizeOf(imagen.rutaImagen),
        horizontal = new Boolean(false),
        modificiar = new Boolean(false),
        new_ancho = 0,
        new_alto = 0,
        porcentaje = 0,
        old_ancho = 0,
        old_alto = 0,
        jsonResp = new Object();

    old_ancho = dimensions.width;
    old_alto = dimensions.height;
    new_alto = old_alto;
    new_ancho = old_ancho;
    if (dimensions.width > config.ANCHO_HOJA) {
        horizontal = true;
    }
    if (horizontal === true) {
        if (dimensions.width > Number(config.ALTO_HOJA)) {
            modificiar = true;
            porcentaje =
                Math.trunc(
                    (Number(config.ALTO_HOJA) * 100) / dimensions.width
                ) / 100;
            new_alto = Math.trunc(dimensions.height * porcentaje);
            new_ancho = Math.trunc(dimensions.width * porcentaje);
        }
    } else {
        if (dimensions.height > Number(config.ALTO_HOJA)) {
            modificiar = true;
            porcentaje =
                Math.trunc(
                    (Number(config.ALTO_HOJA) * 100) / dimensions.height
                ) / 100;
            new_ancho = Math.trunc(dimensions.width * porcentaje);
            new_alto = Math.trunc(dimensions.height * porcentaje);
        }
    }

    jsonResp.alto_orig = old_alto;
    jsonResp.ancho_orig = old_ancho;
    jsonResp.alto_new = new_alto;
    jsonResp.ancho_new = new_ancho;
    jsonResp.modificar = modificiar;
    jsonResp.horizontal = horizontal;
    if (modificiar === true) {
        await this.cambiarTamaño(imagen.rutaImagen, new_ancho, new_alto);
    }
    return jsonResp;
};

exports.cambiarTamaño = async (imagen, width, height) => {
    const image = await Jimp.read(imagen);
    await image.resize(width, height);
    await image.quality(100);
    await image.writeAsync(imagen);
    return image;
};
