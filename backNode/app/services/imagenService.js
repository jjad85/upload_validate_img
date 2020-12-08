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
        modificiar = new Boolean(false),
        porcentaje = 0,
        anchoImg = dimensions.width,
        altoImg = dimensions.height,
        altoHoja = config.ALTO_HOJA,
        anchoHoja = config.ANCHO_HOJA,
        anchoNew = anchoImg,
        altoNew = altoImg,
        jsonResp = new Object();

    if (
        anchoImg > anchoHoja ||
        altoImg > altoHoja ||
        anchoImg > altoHoja ||
        altoImg > anchoHoja
    ) {
        if (anchoImg > altoImg) {
            console.log('Horizontal');
            if (altoImg - anchoHoja > anchoImg - altoHoja) {
                console.log('Caso 1');
                modificiar = Boolean(true);
                porcentaje =
                    Math.ceil(((altoImg - anchoHoja) * 100) / altoImg) / 100;
            } else {
                console.log('Caso 2');
                modificiar = Boolean(true);
                porcentaje =
                    Math.ceil(((anchoImg - altoHoja) * 100) / anchoImg) / 100;
            }
        } else if (altoImg > anchoImg || altoImg == anchoImg) {
            console.log('Vertical/Cuadrada');
            if (altoImg - altoHoja > anchoImg - anchoHoja) {
                console.log('Caso 1');
                modificiar = Boolean(true);
                porcentaje =
                    Math.ceil(((altoImg - altoHoja) * 100) / altoImg) / 100;
            } else {
                console.log('Caso 2');
                modificiar = Boolean(true);
                porcentaje =
                    Math.ceil(((anchoImg - anchoHoja) * 100) / anchoImg) / 100;
            }
        }
    }
    console.log('Resultado: ');
    console.log('porcentaje: ' + porcentaje);
    console.log('altoImg: ' + altoImg);
    console.log('anchoImg: ' + anchoImg);
    console.log('altoNew: ' + altoNew);
    console.log('anchoNew: ' + anchoNew);
    console.log('altoHoja: ' + altoHoja);
    console.log('anchoHoja: ' + anchoHoja);
    console.log('modificar: ' + modificiar);

    if (modificiar === true) {
        anchoNew = Number(anchoImg) * (1 - porcentaje);
        altoNew = Number(altoImg) * (1 - porcentaje);
        console.log('va a modificar img');
        await this.cambiarTamaño(imagen.rutaImagen, anchoNew, altoNew);
    }
    jsonResp.alto_orig = altoImg;
    jsonResp.ancho_orig = anchoImg;
    jsonResp.alto_new = altoNew;
    jsonResp.ancho_new = anchoNew;
    console.log(jsonResp);
    return jsonResp;
};

exports.cambiarTamaño = async (imagen, width, height) => {
    const image = await Jimp.read(imagen);
    await image.resize(width, height);
    await image.quality(100);
    await image.writeAsync(imagen);
    return image;
};
