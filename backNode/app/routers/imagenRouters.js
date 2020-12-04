const contImagen = require('../controllers/imagenController');

module.exports = (router) => {
    router.route('/imagen/').post(contImagen.cargarImagen);
    router.route('/imagen/').get(contImagen.listarImagenes);
    router.route('/subirImagen').post(contImagen.subirArchivo);
};
