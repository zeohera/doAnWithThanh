const express = require('express')
var multer  = require('multer')
const { route } = require('../../routes/product.route')
var controller = require('../controller/product.controller')
const router = express.Router()

router.get('/getDistrictByCity/:id', controller.selectCityStore)

router.get('/getAllCity/', controller.getAllCity)

router.get('/getStoreByDistrict/:id', controller.getDistrictStore)

router.get('/getDeliveryInfo', controller.getBillInfo)

router.get('/', controller.index)

module.exports = router
