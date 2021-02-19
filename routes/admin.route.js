const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/admin.controller');
var validate = require('../validate/adminCreate.validate')
var validate1 = require('../validate/adminUpdate.validate')
const { route } = require('./auth.route');
// const { route } = require('./product.route')

router.get('', controller.index)
// admin manager

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/admin/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

router.get('/adminManager',  controller.adminManager)

router.get('/createAdmin',  controller.addAdmin)

router.post('/createAdmin', upload.single('avatar'), validate.postAdminCreate, controller.postAdminCreate)

router.post('/:id/deleteAdmin' , controller.deleteAdmin)

router.get('/:id/updateAdmin',controller.updateAdmin )

router.post('/postUpdateAdmin/:id' ,upload.single('avatar'), controller.postUpdateAdmin )

// product manager
var storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/products')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var uploadProduct = multer({ storage: storageProduct });

router.get('/productManager', controller.productManager)

router.get('/createProduct', controller.productCreate)

router.post('/createProduct',uploadProduct.single('image'), controller.postProductCreate)

router.post('/:id/deleteProduct' , controller.deleteProduct)
// missing update

// product category manager
router.get('/productCategoryManager', controller.productCategoryManager)

router.get('/createProductCategory', controller.createProductCategory)

router.post('/createProductCategory', controller.postProductCategoryCreate)

router.post('/:id/deleteProductCategory', controller.deleteProductCategory)
//  missing update 

// brand manager

var storageBrand = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/brand/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var uploadBrand = multer({ storage: storageBrand });

router.get('/brandManager', controller.brandManager)

router.get('/addBrand', controller.addBrand)

router.post('/AddBrand', uploadBrand.single('logo'), controller.postAddBrand)

router.post('/:id/deleteBrand' , controller.deleteBrand)

// missing update

// Sub product category manager
router.get('/subProductCategoryManager', controller.subProductCategoryManager)

router.get('/createSubProductCategory', controller.createSubProductCategory)

router.post('/createSubProductCategory', controller.postCreateSubProductCategory)

router.post('/:id/deleteSubProductCategory' , controller.deleteSubProductCategory)
// missing update

module.exports = router