const express = require('express')
var multer  = require('multer')
const router = express.Router()

var controller = require('../controller/admin.controller')
router.get('/store/:id', controller.store)
router.post('/store/edit/:id', controller.editStore)

module.exports = router