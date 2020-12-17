const photoServi = require('../services/photoService');
const ReqFieldException = require('../exceptions/ReqFieldException');
const Photo = require('../models/photoModels');

/****************************************************************************
 * Metodo:
 *      Es el metodo que recibe el REQUEST desde los diferentes consumidores
 *      tomando la imagen y analizando los diferentes escenarios posibles
 *      con la imagen
 * Parametros:
 *    @req: Es el request que se envia desde la página web
 *    @res: Es el response que la página web se queda esperando como respuesta
 * Return:
 *    @photo_finish: Es un JSON que contiene la imagen insertada, este JSON
 *                  se responde mediante un RESPONSE a los diferentes
 *                  consumidores, este response lleva el codigo 200 de
 *                  respuesta
 ****************************************************************************/
exports.uploadPhoto = async (req, res) => {
  /***************************************************
   * Definción de variables
   ***************************************************/
  let path = req.file.path,
    new_width = 0,
    new_height = 0,
    jsonResp = new Object(),
    nomFile = req.body.title;

  /***************************************************
   * Cargar imagen a AWS imagen Original
   ***************************************************/
  let urlAWS = await photoServi.uploadImagenAWS(path, nomFile);
  jsonResp.urlAWSOriginal = urlAWS.Location;

  /***************************************************
   * Consulta de dimensiones actuales de la imagen
   ***************************************************/
  let photo_dimensions = await photoServi.getSizePhoto(path);

  /***************************************************
   * Calculo de nuevas dimensiones de imagen
   ***************************************************/
  let new_dimensions = await photoServi.calculateNewImageValues(photo_dimensions);
  new_height = new_dimensions.height_new;
  new_width = new_dimensions.width_new;

  /***************************************************
   * Modificación de imagen en casod e ser necesario
   ***************************************************/
  var newPath = path;
  if (new_dimensions.change_img === true) {
    newPath = await photoServi.changeSizeNewPhoto(path, new_width, new_height);
  }
  jsonResp.photoPathUpdate = newPath;

  /***************************************************
   * Cargar imagen a AWS imagen New
   ***************************************************/
  var nom = nomFile.split('.');
  nom[0] = nom[0] + '_update';
  nomFile = nom[0] + '.' + nom[1];
  nom = path.split('.');
  nom[0] = nom[0] + '_update';
  var pathNew = nom[0] + '.' + nom[1];
  urlAWS = await photoServi.uploadImagenAWS(pathNew, nomFile);
  jsonResp.urlAWSModificada = urlAWS.Location;

  /***************************************************
   * Construcción del JSON Final
   ***************************************************/
  jsonResp.photoPath = path;
  jsonResp.title = req.body.title;
  jsonResp.idTrx = req.body.idTrx;
  jsonResp.photo_height = photo_dimensions.height;
  jsonResp.photo_width = photo_dimensions.width;
  jsonResp.new_height = new_height;
  jsonResp.new_width = new_width;

  /***************************************************
   * Obtener las dimensiones de la Web
   ***************************************************/
  let jsonDimWeb = await photoServi.getDimensionsWeb(
    photo_dimensions.width,
    photo_dimensions.height,
    new_dimensions.change_img
  );
  jsonResp.photo_height_web = jsonDimWeb.photo_height_web;
  jsonResp.photo_width_web = jsonDimWeb.photo_width_web;
  jsonResp.new_height_web = jsonDimWeb.new_height_web;
  jsonResp.new_width_web = jsonDimWeb.new_width_web;

  /***************************************************
   * Guardar Datos en BD MongoDB
   ***************************************************/
  let photo_finish = await photoServi.saveInfoBD(jsonResp);
  res.status(200).send(photo_finish);
};

/****************************************************************************
 * Metodo:
 *      Es el metodo que consulta una imagen segun el codigo unico de la
 *      misma
 * Parametros:
 *    @req: Es el request que se envia desde la página web
 *    @res: Es el response que la página web se queda esperando como respuesta
 * Return:
 *    @photo: Es un JSON que contiene la información de la imagen consultada
 ****************************************************************************/
exports.getInfoPhoto = async (req, res) => {
  const { id } = req.params;
  const photo = await Photo.findById(id);
  return res.json(photo);
};

/****************************************************************************
 * Metodo:
 *      Es el metodo que consulta las imagenes correspondiente a un
 *      código unico de transacción enviado desde la Web
 * Parametros:
 *    @req: Es el request que se envia desde la página web
 *    @res: Es el response que la página web se queda esperando como respuesta
 * Return:
 *    @photos: Es un JSON que contiene la información de las diferentes
 *          imagenes consultadas
 ****************************************************************************/
exports.getPhotos = async (req, res) => {
  let idTrx = req.params;
  let photos = await photoServi.getBulkPhotos(idTrx);
  res.status(200).send(photos);
};

/****************************************************************************
 * Metodo:
 *      Es el metodo que consulta todas las imagenes cargadas
 * Parametros:
 *    @req: Es el request que se envia desde la página web
 *    @res: Es el response que la página web se queda esperando como respuesta
 * Return:
 *    @photos: Es un JSON que contiene la información de todas las imagenes
 ****************************************************************************/
exports.getAllPhotos = async (req, res) => {
  let photos = await photoServi.getAllPhotos();
  res.status(200).send(photos);
};
