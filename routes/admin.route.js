const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/admin.controller');
var validate = require('../validate/adminCreate.validate')
var validate1 = require('../validate/adminUpdate.validate')
const { route } = require('./auth.route');
// const { route } = require('./product.route')

router.get('/generateReport', controller.generateReport)

router.get('/deleteReport/:name', controller.deleteReport)


router.get('', controller.index)
// admin manager

var storageAdmin = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/images/admin/')
  //   cb(null, '')
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var uploadAdmin = multer({ storage: storageAdmin });

router.get('/adminManager',  controller.adminManager)

router.get('/createAdmin',  controller.addAdmin)

router.post('/createAdmin', uploadAdmin.single('avatar'), validate.postAdminCreate, controller.postAdminCreate)

router.post('/:id/deleteAdmin' , controller.deleteAdmin)

router.get('/:id/detailAdmin', controller.detailAdmin)

router.get('/:id/updateAdmin',controller.updateAdmin )

router.post('/postUpdateAdmin/:id' ,uploadAdmin.single('avatar'), controller.postUpdateAdmin)

// product manager
var storageProduct = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/images/products')
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var uploadProduct = multer({ storage: storageProduct });

router.get('/productManager', controller.productManager)

router.get('/createProduct', controller.productCreate)

router.post('/createProduct',uploadProduct.single('image'), controller.postProductCreate)

router.post('/:id/deleteProduct' , controller.deleteProduct)

router.get('/:id/productUpdate', controller.productUpdate)

router.post('/productUpdate/:id',uploadProduct.single('image'), controller.postProductUpdate)

router.post('/:id/changePublicState', controller.changePublicState)

// product category manager
var storageCategoryImage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/images/categoryBackground/')
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var uploadCategoryImage = multer({ storage: storageCategoryImage });

router.get('/productCategoryManager', controller.productCategoryManager)

router.get('/createProductCategory', controller.createProductCategory)

router.post('/createProductCategory',uploadCategoryImage.single('image'), controller.postProductCategoryCreate)

router.post('/:id/deleteProductCategory', controller.deleteProductCategory)

router.get('/updateProductCategory/:id', controller.updateProductCategory)

router.post('/updateProductCategory/:id',uploadCategoryImage.single('image'), controller.postUpdateProductCategory)

//  missing update 

// brand manager

var storageBrand = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/images/brand/')
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var uploadBrand = multer({ storage: storageBrand });

router.get('/brandManager', controller.brandManager)

router.get('/addBrand', controller.addBrand)

router.post('/AddBrand', uploadBrand.single('logo'), controller.postAddBrand)

router.post('/:id/deleteBrand' , controller.deleteBrand)

router.get('/updateBrand/:id', controller.updateBrand)

router.post('/updateBrand/:id', uploadBrand.single('image'), controller.postUpdateBrand)

// missing update

// Sub product category manager
router.get('/subProductCategoryManager', controller.subProductCategoryManager)

router.get('/createSubProductCategory', controller.createSubProductCategory)

router.post('/createSubProductCategory', controller.postCreateSubProductCategory)

router.post('/:id/deleteSubProductCategory' , controller.deleteSubProductCategory)

router.get('/updateSubCategory/:id', controller.updateSubCategory)

router.post('/updateSubCategory/:id', controller.postUpdateSubCategory)

// missing update

// order manager 
router.get('/orderManager', controller.orderManager)

router.get('/order/:id', controller.orderDetail)

router.post('/postUpdateOrderDetail/:id' , controller.postUpdateOrderDetail)

router.post('/sendMail/:mail', controller.mailSend)


// Banner 
router.get('/bannerManager', controller.bannerImageManager)

router.get('/uploadBanner', controller.bannerUploader)


var storageBanner = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/images/banner/')
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var uploadBanner = multer({ storage: storageBanner });

router.post('/uploadBanner', uploadBanner.single('image'), controller.postBannerUploader)

router.post('/:id/deleteBanner', controller.deleteBanner)

router.get('/store', controller.store)

router.post('/addCity', controller.addCity)

router.post('/removeCity', controller.removeCity)

router.post('/addDistrict', controller.addDistrict)

router.post('/removeDistrict', controller.removeDistrict)

router.post('/addStore', controller.addStore)

router.post('/removeStore', controller.removeStore)

module.exports = router