const contPhoto = require('../controllers/photoController');
const multer = require('../libs/multer');

module.exports = (router) => {
  router.route('/photo').post(multer.single('image'), contPhoto.uploadPhoto);
  router.route('/photo/:id').get(contPhoto.getInfoPhoto);
  router.route('/photos/:id').get(contPhoto.getPhotos);
  router.route('/allphotos').get(contPhoto.getAllPhotos);
};
