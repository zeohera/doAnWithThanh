const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/admin.controller');
var validate = require('../validate/adminCreate.validate')
var validate1 = require('../validate/adminUpdate.validate')
const { route } = require('./auth.route');
// const { route } = require('./product.route')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/admin/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

router.get('', controller.index)
// admin manager
router.get('/adminManager',  controller.adminManager)

router.get('/createAdmin',  controller.addAdmin)

router.post('/createAdmin', upload.single('avatar'), validate.postAdminCreate, controller.postAdminCreate)

router.post('/:id/deleteAdmin' , controller.deleteAdmin)

router.get('/:id/updateAdmin',controller.updateAdmin )

router.post('/postUpdateAdmin/:id' ,upload.single('avatar'), controller.postUpdateAdmin )

// product manager
router.get('/productManager', controller.productManager)

router.get('/createProduct', controller.productCreate)

router.post('/:id/deleteProduct' , controller.deleteProduct)

// product category manager
router.get('/productCategoryManager', controller.productCategoryManager)

router.get('/createProductCategory', controller.createProductCategory)

router.post('/createProductCategory', controller.postProductCategoryCreate)
module.exports = router