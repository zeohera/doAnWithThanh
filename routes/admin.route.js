const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/admin.controller');
var validate = require('../validate/adminCreate.validate')
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
// product manager
router.get('/productManager', controller.productManager)


// product category manager
router.get('/productCategoryManager', controller.productCategoryManager)
module.exports = router