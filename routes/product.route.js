const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/product.controller')
var validate = require('../validate/product.validate')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

router.get('', controller.index)

router.get('/index', controller.index)

router.get('/category', controller.category)

router.get('/shoppingCart', controller.shoppingCart)

router.get('/shoppingCart/remove/:id', controller.removeCartItem)

router.get('/addToShoppingCart/:id', controller.addToShoppingCart)

router.get('/checkOut', controller.checkOut)

router.post('/checkOut', controller.postCheckOut)

router.get('/brandInfo/:brand', controller.brandInfo)

router.get('/search', controller.search)

router.get('/:id', controller.detail)

router.post('/create', upload.single('avatar'), validate.postCreate, controller.postCreate)

module.exports = router

