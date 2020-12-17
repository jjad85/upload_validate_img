const photoModel = require('../models/photoModels');
const sizeOf = require('image-size');
const config = require('../configs/config');
var Jimp = require('jimp');
const fs = require('fs');
const AWS = require('aws-sdk');

/****************************************************************************
 * Configuración de región y parametros de AWS S3
 ****************************************************************************/
AWS.config.update({ region: 'us-east-2' });
const s3 = new AWS.S3({
  accessKeyId: config.AWSID,
  secretAccessKey: config.AWSSECRET,
});

/****************************************************************************
 * Metodo:
 *    Carga de imagen a S3 AWS
 * Parametros:
 *    @rutaImagen: Es la ruta donde se encuentra la imagen en el sevidor
 *    @nombreImagen: Es el nombre de la imagen con el cual se guarda en S3
 * Return:
 *    @infoS3: Contiene la información del resultado de la operación
 ****************************************************************************/
exports.uploadImagenAWS = async (rutaImagen, nombreImagen) => {
  const fileContent = fs.readFileSync(rutaImagen);

  const params = {
    Bucket: config.BUCKET_NAME,
    Key: nombreImagen,
    Body: fileContent,
  };

  let infoS3 = await s3
    .upload(params, function (err, data) {
      if (err) {
        throw err;
      }
    })
    .promise();
  return infoS3;
};

/****************************************************************************
 * Metodo:
 *    Calcula las dimensiones de una imagen a presentar
 *    en la Web
 * Parametros:
 *    @width_img: Es el ancho original de la imagen
 *    @height_img: Es el alto original de la imagen
 *    @swMod: Indica si la imagen fue modificada o no
 * Return:
 *    @jsonResp: JSon que contiene las dimensiones
 *              representativas de las imagenes
 *              original y modificada en proporción para
 *              presentar en la Web. Los atributos del
 *              JSON son:
 *      * photo_height_web --- Alto Img Original para web
 *      * photo_width_web --- Ancho Img Original para web
 *      * new_height_web --- Alto Img Nueva para web
 *      * new_width_web --- Ancho Img Nueva para web
 ****************************************************************************/
exports.getDimensionsWeb = async (width_img, height_img, swMod) => {
  let webH, webW, webNH, webNW;
  webH = config.DIMENSIONSWEB;
  webW = config.DIMENSIONSWEB;
  if (height_img > width_img) {
    webH = config.DIMENSIONSWEB;
    webW = Math.ceil((((webH * 100) / height_img) * width_img) / 100);
  } else if (width_img > height_img) {
    webW = config.DIMENSIONSWEB;
    webH = Math.ceil((((webW * 100) / width_img) * height_img) / 100);
  }
  webNH = webH;
  webNW = webW;
  if (swMod === true) {
    webNH = Math.ceil(webH * 0.85);
    webNW = Math.ceil(webW * 0.85);
  }
  let jsonResp = new Object();
  jsonResp.photo_height_web = webH.toString();
  jsonResp.photo_width_web = webW.toString();
  jsonResp.new_height_web = webNH.toString();
  jsonResp.new_width_web = webNW.toString();
  return jsonResp;
};

/****************************************************************************
 * Metodo:
 *    Obtiene las dimensiones de una imagen dentro del servidor
 * Parametros:
 *    @photoPath: Es la ruta donde se encuentra la imagen en el sevidor
 ** Return:
 *    @dimensions: Es un objeto que contiene como propiedad las dimensiones
 *                de la imagen
 ****************************************************************************/
exports.getSizePhoto = async (photoPath) => {
  const dimensions = sizeOf(photoPath);
  return dimensions;
};

/****************************************************************************
 * Metodo:
 *    Obtiene que analiza la imagen acorde a las dimensiones de la misma y
 *    las dimensiones de la hoja donde se imprimira la imagen, para cualcular
 *    si es necesario reducir el tamaño de la imagen y si es necesario girar
 *    la orientación de la hoja.
 * Parametros:
 *    @photoPath: Es la ruta donde se encuentra la imagen en el sevidor
 ** Return:
 *    @dimensions: Es un objeto que contiene como propiedad las dimensiones
 *                de la imagen y el tipo de archivo
 ****************************************************************************/
exports.calculateNewImageValues = async (photo_dimensions) => {
  let width_hoja = config.WIDTH_HOJA,
    height_hoja = config.HEIGHT_HOJA,
    width_img = 180,
    height_img = 70,
    percentage = 0,
    height_new = 0,
    width_new = 0;
  change_img = new Boolean(false);
  let jsonResp = new Object();

  height_img = photo_dimensions.height;
  width_img = photo_dimensions.width;

  if (
    (width_img <= width_hoja && height_img <= height_hoja) ||
    (width_img <= height_hoja && height_img <= width_hoja)
  ) {
    jsonResp.change_img = false;
    jsonResp.height_new = height_img;
    jsonResp.width_new = width_img;
    return jsonResp;
  }

  /************************************************************************
   * Imagen esta horizontal y debo de rotar la hoja.
   ************************************************************************/
  if (width_img > height_img && width_img > width_hoja) {
    /*******************************************************************
     * Encontrar si el cambio de tamaño esta mayor en el ancho o alto
     * de la imagen.
     *******************************************************************/
    if (width_img - height_hoja > height_img - width_hoja) {
      percentage = Math.ceil(((width_img - height_hoja) * 100) / width_img) / 100;
    } else {
      percentage = Math.ceil(((height_img - width_hoja) * 100) / height_img) / 100;
    }
    /************************************************************************
     * Imagen esta vertical.
     ************************************************************************/
  } else {
    /*******************************************************************
     * Encontrar si el cambio de tamaño esta mayor en el ancho o alto
     * de la imagen.
     *******************************************************************/
    if (width_img - width_hoja > height_img - height_hoja) {
      percentage = Math.ceil(((width_img - width_hoja) * 100) / width_img) / 100;
    } else {
      percentage = Math.ceil(((height_img - height_hoja) * 100) / height_img) / 100;
    }
  }

  width_new = Math.ceil(width_img - width_img * percentage);
  height_new = Math.ceil(height_img - height_img * percentage);
  jsonResp.change_img = true;
  jsonResp.height_new = height_new;
  jsonResp.width_new = width_new;
  return jsonResp;
};

/****************************************************************************
 * Metodo:
 *    Cambia el tamaño de la imagen acorde a los valores calculados en
 *    otro metodo, este metodo crea una lueva imagen con el nombre de
 *    _update
 * Parametros:
 *    @photo: Es la ruta donde se encuentra la imagen en el sevidor
 *    @width: Es el ancho nuevo de la imagen
 *    @height: Es el alto nuevo de la imagen
 ** Return:
 *    @rutaNew: Es la ruta de la nueva imagen con las nuevas medidas
 ****************************************************************************/
exports.changeSizeNewPhoto = async (photo, width, height) => {
  const photoNew = await Jimp.read(photo);
  await photoNew.resize(width, height);
  await photoNew.quality(100);
  var nom = photo.split('.');
  nom[0] = nom[0] + '_update';
  var rutaNew = nom[0] + '.' + nom[1];
  await photoNew.writeAsync(rutaNew);
  return rutaNew;
};

/****************************************************************************
 * Metodo:
 *    Almacena la información de la imagen en la base de datos, acorde a los
 *    campos definidos en el modelo
 * Parametros:
 *    @jsonResp: Es el JSon que contiene la información de la imagen a guardar
 *              en la base de datos.
 * Return:
 *    @addImage: Es el objeto que se inserto en la base de datos.
 ****************************************************************************/
exports.saveInfoBD = async (jsonResp) => {
  const recentPhoto = photoModel(jsonResp);
  let addImage = await recentPhoto.save();
  return addImage;
};

/****************************************************************************
 * Metodo:
 *    Metodo que retorna las imagenes cargadas en una transacción que se
 *    invoca desde la Web.
 * Parametros:
 *    @idTrx: Es el código unico de transacción que se envia desde la Web
 * Return:
 *    @addImage: Es un objeto que contiene las imagenes de una transacción
 ****************************************************************************/
exports.getBulkPhotos = async (idTrx) => {
  let photos = await photoModel.find({ idTrx: idTrx.id });
  return photos;
};

/****************************************************************************
 * Metodo:
 *    Metodo que retorna todas las imagenes cargadas.
 * Parametros:
 *   NA
 * Return:
 *    @photos: Es un objeto que contiene todas las imagenes
 ****************************************************************************/
exports.getAllPhotos = async () => {
  let photos = await photoModel.find();
  return photos;
};
