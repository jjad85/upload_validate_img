const imagenService = require('../services/imagenService');
const ReqFieldException = require('../exceptions/ReqFieldException');
const ExceptionGeneral = require('../exceptions/ExceptionGeneral');
var pathF = require('path');

exports.cargarImagen = async (req, res) => {
    if (!req.body.rutaImagen) {
        throw new ReqFieldException('rutaImagen');
    }
    if (!req.body.nombreImagen) {
        throw new ReqFieldException('nombreImagen');
    }

    let urlAWS = await imagenService.uploadImagenAWS(
        req.body.rutaImagen,
        req.body.nombreImagen
    );
    req.body.urlAWSOriginal = urlAWS.Location;
    let jsonMod = await imagenService.obtenerTamanoImagen(req.body);
    req.body.alto_orig = jsonMod.alto_orig;
    req.body.ancho_orig = jsonMod.ancho_orig;
    req.body.alto_new = jsonMod.alto_new;
    req.body.ancho_new = jsonMod.ancho_new;
    req.body.modificada = jsonMod.modificar;
    req.body.horizontal = jsonMod.horizontal;
    var nomImagenNew = req.body.nombreImagen;
    var nom = nomImagenNew.split('.');
    nom[0] = nom[0] + '_update';
    nomImagenNew = nom[0] + '.' + nom[1];

    urlAWS = await imagenService.uploadImagenAWS(
        req.body.rutaImagen,
        nomImagenNew
    );
    req.body.urlAWSModificada = urlAWS.Location;

    let imagen = await imagenService.insertImagenBD(req.body);
    res.status(200).send(imagen);
};

exports.listarImagenes = async (req, res) => {
    let imagenes = await imagenService.listarImagenes();
    if (!imagenes) {
        throw new ExceptionGeneral('No hay imagenes', 401);
    }
    res.status(200).send(imagenes);
};

exports.subirArchivo = async (req, res, next) => {
    const archivo = req.files.archivo;
    const fileName = archivo.name;
    const path = __dirname + '/../uploads/' + fileName;

    archivo.mv(path, (error) => {
        if (error) {
            console.error(error);
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ status: 'error', message: error }));
            return;
        }

        var jsonPath = pathF.join(__dirname, '..', 'uploads', fileName);
        return res.status(200).send({
            status: 'success',
            path: jsonPath
        });
    });
};
